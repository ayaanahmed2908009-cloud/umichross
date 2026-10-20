import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const sourcePath = 'public/assets/python/SolarPak_Flow_Animation.py';

async function openSupportingSource(page: import('@playwright/test').Page) {
  await page.locator('.supporting-work > summary').click();
  await page.getByRole('button', { name: 'View original Python source' }).click();
}

test('the opening is one scrolling story with larger text and a black introduction', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Hi, Admissions Officer.');
  await expect(page.locator('.story-chapter')).toHaveCount(4);
  const boxes = await page.locator('.story-chapter').evaluateAll(elements => elements.map(element => ({ top: element.getBoundingClientRect().top, height: element.getBoundingClientRect().height })));
  for (let i = 1; i < boxes.length; i++) expect(boxes[i].top).toBeGreaterThanOrEqual(boxes[i - 1].top + boxes[i - 1].height - 1);
  await page.getByRole('link', { name: 'Scroll to begin' }).click();
  await expect(page).toHaveURL(/\/#introduction$/);
  await expect(page.locator('#introduction-title')).toBeInViewport();
  expect(await page.locator('#introduction').evaluate(element => getComputedStyle(element).backgroundColor)).toBe('rgb(10, 10, 10)');
  await page.getByRole('navigation', { name: 'Story navigation' }).getByRole('link', { name: 'Story', exact: true }).click();
  await expect(page.locator('#origin-title')).toBeInViewport();
  await page.getByRole('navigation').getByRole('link', { name: 'Design', exact: true }).click();
  await expect(page.locator('#design-title')).toBeInViewport();
  await expect(page.getByRole('img', { name: /My original 3D concept/ })).toBeVisible();
  expect(await page.evaluate(() => location.pathname)).toBe('/');
  expect(await page.locator('#origin .chapter-prose > p').first().evaluate(element => parseFloat(getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(20);
  expect(errors).toEqual([]);
});

test('the business overview has three plain-language choices and working playback', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  const player = page.locator('.simulation-player');
  await player.scrollIntoViewIfNeeded();
  await expect(page.getByRole('group', { name: 'Explore the idea' }).getByRole('button')).toHaveCount(3);
  await expect(page.locator('.source-excerpt')).toHaveCount(0);
  await expect(page.locator('.source-line')).toHaveCount(0);
  await expect(page.locator('.supporting-links')).not.toBeVisible();
  await player.getByRole('button', { name: 'Store water', exact: true }).click();
  await expect(page.locator('.stage-copy h3')).toHaveText('Keep water in reserve.');
  await player.getByRole('button', { name: 'Reach the taps', exact: true }).click();
  await expect(page.locator('.stage-copy h3')).toHaveText('Let gravity do the rest.');
  await player.getByRole('button', { name: 'Restart overview' }).click();
  const timeline = player.getByRole('slider', { name: 'Overview timeline' });
  await expect(timeline).toHaveValue('0');
  await player.getByRole('button', { name: 'Play overview' }).click();
  await expect.poll(async () => Number(await timeline.inputValue())).toBeGreaterThan(0);
  await player.getByRole('button', { name: 'Pause overview' }).click();
  const paused = await timeline.inputValue();
  await page.waitForTimeout(150);
  await expect(timeline).toHaveValue(paused);
  await timeline.fill('0.8');
  await expect(page.locator('.stage-copy h3')).toHaveText('Keep water in reserve.');
  await expect(page.locator('#outcome')).toContainText('not yet served');
});

test('optional original source stays complete, mapped, searchable and downloadable', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const original = await readFile(sourcePath, 'utf8');
  await page.goto('/');
  await openSupportingSource(page);
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

test('mobile and reduced motion keep the full story scrollable and readable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  for (const id of ['welcome', 'introduction', 'origin', 'design']) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await expect(page.locator(`#${id}-title`)).toBeVisible();
    expect(await page.evaluate(() => location.pathname)).toBe('/');
  }
  expect(await page.locator('#origin .chapter-prose > p').first().evaluate(element => parseFloat(getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(18);
  await page.getByRole('button', { name: 'Reach the taps', exact: true }).click();
  await expect(page.locator('.stage-copy h3')).toHaveText('Let gravity do the rest.');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await page.locator('.overview-content').evaluate(element => getComputedStyle(element).position)).toBe('static');
  await openSupportingSource(page);
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('large optional source files remain fully searchable without rendering every line', async ({ page }) => {
  // Intercepted test fixture only; never published as original source.
  const fixture = Array.from({ length: 2000 }, (_, i) => `# Test fixture line ${i + 1}`).join('\n');
  await page.route('**/assets/python/SolarPak_Flow_Animation.py', route => route.fulfill({ status: 200, contentType: 'text/plain', body: fixture }));
  await page.goto('/');
  await openSupportingSource(page);
  const modal = page.getByRole('dialog');
  await modal.getByRole('textbox', { name: 'Search Python source' }).fill('fixture line 1999');
  await expect(modal.locator('.search-match')).toContainText('1999');
  await modal.getByRole('spinbutton', { name: 'Jump to line' }).fill('2000');
  await modal.getByRole('button', { name: 'Go', exact: true }).click();
  await expect(modal.locator('.source-line').last()).toContainText('2000');
  expect(await modal.locator('.source-line').count()).toBeLessThan(100);
});

test('earlier chapter links still reach the right part of the scrolling story', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const path of ['introduction', 'origin', 'design']) {
    await page.goto(`/${path}`);
    await expect(page).toHaveURL(new RegExp(`/#[^/]*${path}$`));
    await expect(page.locator(`#${path}-title`)).toBeInViewport();
  }
  await page.goto('/project');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Hi, Admissions Officer.');
});
