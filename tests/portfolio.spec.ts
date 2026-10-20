import { test, expect } from '@playwright/test';

test('desktop narrative, reversible stages and independent playback', async ({ page }) => {
 const errors: string[] = []; page.on('pageerror',e=>errors.push(e.message));
 await page.setViewportSize({width:1440,height:1000});
 await page.goto('/'); await expect(page.getByRole('heading',{level:1})).toContainText('PROJECT');
 await page.locator('#simulation').scrollIntoViewIfNeeded();
 await page.getByRole('button',{name:'07 Gravity-fed distribution'}).click();
 await expect(page.locator('.stage-copy h3')).toHaveText('Gravity-fed distribution');
 await page.getByRole('button',{name:'02 Pump activation'}).click();
 await expect(page.locator('.stage-copy h3')).toHaveText('Pump activation');
 const player=page.locator('.simulation-player');await player.scrollIntoViewIfNeeded();
 const timeline=player.getByRole('slider'); await timeline.fill('0.8');await expect(timeline).toHaveValue('0.8');
 await player.getByRole('button',{name:'Restart animation'}).click();await expect(timeline).toHaveValue('0');
 await player.getByRole('button',{name:'Play animation'}).click();await expect.poll(async()=>Number(await timeline.inputValue())).toBeGreaterThan(0);
 await player.getByRole('button',{name:'Pause animation'}).click();const paused=await timeline.inputValue();await page.waitForTimeout(150);await expect(timeline).toHaveValue(paused);
 await player.getByRole('button',{name:'Hide annotations'}).click();await expect(player.locator('svg text')).toHaveCount(0);
 await expect(page.locator('#outcome')).toContainText('not yet served',{ignoreCase:true});expect(errors).toEqual([]);
});

test('mobile navigation, explicit stages, modal keyboard and reduced motion',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 await page.getByRole('button',{name:'Open navigation'}).click();await page.getByRole('navigation').getByRole('link',{name:'Simulation',exact:true}).click();
 await expect(page.locator('.stage-copy h3')).toHaveText('Solar energy');
 await page.locator('.mobile-stage-controls').getByRole('button',{name:'Next',exact:true}).click();await expect(page.locator('.stage-copy h3')).toHaveText('Pump activation');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 expect(await page.locator('.walkthrough').evaluate(e=>(e as HTMLElement).offsetHeight)).toBeLessThan(1800);
 await page.getByRole('button',{name:'Expand full source'}).click();await expect(page.locator('dialog')).toBeVisible();await expect(page.locator('dialog')).toContainText('Source file pending');await page.keyboard.press('Escape');await expect(page.locator('dialog')).not.toBeVisible();
});

test('full original-source architecture searches and jumps across a large fixture',async({page})=>{
 // Synthetic test data is intercepted only in this test; never published as original source.
 const fixture=Array.from({length:2000},(_,i)=>`# Test fixture line ${i+1}`).join('\n');
 await page.route('**/assets/python/SolarPak_Flow_Animation.py',route=>route.fulfill({status:200,contentType:'text/plain',body:fixture}));
 await page.goto('/');await page.getByRole('button',{name:'Explore the code',exact:true}).first().click();
 const modal=page.locator('dialog');await modal.getByRole('textbox',{name:'Search Python source'}).fill('fixture line 1999');await expect(modal.locator('.search-match')).toContainText('1999');
 await modal.getByRole('spinbutton',{name:'Jump to line'}).fill('2000');await modal.getByRole('button',{name:'Go',exact:true}).click();await expect(modal.locator('.source-line').last()).toContainText('2000');
 await expect(modal.getByRole('link',{name:'Download original Python file'})).toHaveAttribute('href','/assets/python/SolarPak_Flow_Animation.py');
 expect(await modal.locator('.source-line').count()).toBeLessThan(100);
 await modal.getByRole('combobox',{name:'Jump to animation stage source'}).selectOption('6');await expect(modal.getByRole('status')).toContainText('No verified source mapping');
});
