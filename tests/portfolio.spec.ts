import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const sourcePath = 'public/assets/python/SolarPak_Flow_Animation.py';

test('one walkthrough supports stages, mapped source, playback and reverse scrolling', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('PROJECTWATER.');
  await expect(page.locator('.simulation-player')).toHaveCount(1);
  const walkthrough = page.locator('.walkthrough');
  const bounds = await walkthrough.boundingBox();
  const scrollToProgress = async (value: number) => page.evaluate(({ top, height, value }) => {
    const start = top - 78;
    const end = top + height - innerHeight;
    scrollTo({ top: start + (end - start) * value, behavior: 'instant' });
  }, { top: bounds!.y, height: bounds!.height, value });
  await scrollToProgress(.92);
  await expect(page.locator('.stage-copy h3')).toHaveText('Gravity-fed distribution');
  await scrollToProgress(.16);
  await expect(page.locator('.stage-copy h3')).toHaveText('Pump activation');
  await expect(page.locator('.source-excerpt')).toContainText('along(power');
  const player = page.locator('.simulation-player');
  const timeline = player.getByRole('slider');
  await timeline.fill('0.8');
  await expect(page.locator('.stage-copy h3')).toHaveText('Storage tank');
  await expect(page.locator('.source-excerpt')).toContainText('box(flt)');
  await player.locator('summary').click();
  await player.getByRole('button', { name: 'Restart', exact: true }).click();
  await expect(timeline).toHaveValue('0');
  await player.getByRole('button', { name: 'Play animation' }).click();
  await expect.poll(async () => Number(await timeline.inputValue())).toBeGreaterThan(0);
  await player.getByRole('button', { name: 'Pause animation' }).click();
  const paused = await timeline.inputValue();
  await page.waitForTimeout(150);
  await expect(timeline).toHaveValue(paused);
  await player.getByRole('button', { name: 'Show annotations' }).click();
  expect(await player.locator('svg text').count()).toBeGreaterThan(0);
  await expect(page.locator('#outcome')).toContainText('not yet served');
  expect(errors).toEqual([]);
});

test('original source is complete, downloadable, searchable and mapped to real lines', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const original = await readFile(sourcePath, 'utf8');
  await page.goto('/');
  await page.getByRole('button', { name: 'Explore the code', exact: true }).first().click();
  const modal = page.getByRole('dialog');
  await expect(modal).toBeVisible();
  await modal.getByRole('textbox', { name: 'Search Python source' }).fill('finally:');
  await expect(modal.locator('.search-match')).toContainText('finally:');
  await modal.getByRole('combobox', { name: 'Jump to animation stage source' }).selectOption('6');
  await expect(modal.locator('.editor-footer')).toContainText('Gravity-fed distribution · L118–125, L59–59');
  await expect(modal.locator('.source-line.selected').first()).toContainText('if t > 6 * SEG:');
  await modal.getByRole('button', { name: 'Copy complete source' }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(original);
  const downloadPromise = page.waitForEvent('download');
  await modal.getByRole('link', { name: 'Download original Python file' }).click();
  const download = await downloadPromise;
  expect(await readFile((await download.path())!, 'utf8')).toBe(original);
  await page.keyboard.press('Escape');
  await expect(modal).not.toBeVisible();
});

test('mobile and reduced motion use short, explicit stages and optional code', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.getByRole('navigation').getByRole('link', { name: 'The system', exact: true }).click();
  await expect(page.locator('.stage-copy h3')).toHaveText('Solar energy');
  await expect(page.locator('.source-toggle')).toHaveAttribute('aria-expanded', 'false');
  await page.getByRole('button', { name: 'Next stage', exact: true }).click();
  await expect(page.locator('.stage-copy h3')).toHaveText('Pump activation');
  await page.locator('.source-toggle').click();
  await expect(page.locator('.source-excerpt')).toContainText('along(power');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await page.locator('.walkthrough').evaluate(element => (element as HTMLElement).offsetHeight)).toBeLessThan(1400);
  await page.locator('.stage-panel').getByRole('button', { name: 'Explore the code' }).click();
  await expect(page.locator('dialog .editor-footer')).toContainText('Pump activation');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('large sources remain fully searchable without rendering every line', async ({ page }) => {
  // Intercepted test fixture only; never published as original source.
  const fixture = Array.from({ length: 2000 }, (_, i) => `# Test fixture line ${i + 1}`).join('\n');
  await page.route('**/assets/python/SolarPak_Flow_Animation.py', route => route.fulfill({ status: 200, contentType: 'text/plain', body: fixture }));
  await page.goto('/');
  await page.getByRole('button', { name: 'Explore the code', exact: true }).first().click();
  const modal = page.getByRole('dialog');
  await modal.getByRole('textbox', { name: 'Search Python source' }).fill('fixture line 1999');
  await expect(modal.locator('.search-match')).toContainText('1999');
  await modal.getByRole('spinbutton', { name: 'Jump to line' }).fill('2000');
  await modal.getByRole('button', { name: 'Go', exact: true }).click();
  await expect(modal.locator('.source-line').last()).toContainText('2000');
  expect(await modal.locator('.source-line').count()).toBeLessThan(100);
});
