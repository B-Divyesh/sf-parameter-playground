import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';

test('runs the prediction, parameter, inspection, and explanation loop', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /start with your own lesson/i }).click();
  await expect(page.getByRole('heading', { name: 'Build a model lesson' })).toBeVisible();
  await page.getByLabel('My prediction').fill('I predict clustering will shorten the route.');
  await page.getByRole('button', { name: 'Commit prediction' }).click();
  await expect(page.getByText(/prediction committed — now test it/i)).toBeVisible();
  const range = page.getByRole('slider', { name: 'Clustering' });
  await range.fill('65');
  await expect(page.locator('#live-update')).toContainText('Route recalculated');
  await expect(page.locator('#data-table tbody tr')).toHaveCount(9);
  await page.getByLabel('and observed').fill('The total route became shorter and the city groups became more visible.');
  await page.getByRole('button', { name: 'Complete explanation' }).click();
  await expect(page.getByText(/complete: you changed clustering/i)).toBeVisible();
});

test('switches templates and exposes bounded assumptions', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /logistic population growth/i }).click();
  await expect(page.getByRole('heading', { name: 'Why growth slows near a limit' })).toBeVisible();
  await expect(page.getByRole('slider', { name: 'Growth rate' })).toHaveAttribute('max', '0.8');
  await page.getByText('Assumptions & numeric limits').click();
  await expect(page.locator('#active-limits')).toContainText('5–30 discrete steps');
});

test('has no serious accessibility violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page: page as never }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
});

test('fits a 390px viewport without page-level horizontal scrolling', async ({ page }) => {
  await page.goto('/');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await expect(page.getByRole('button', { name: 'Copy lesson link' })).toBeVisible();
});

test('loads a shareable preset without a server account', async ({ context, page }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: 'http://127.0.0.1:4173' });
  await page.goto('/');
  await page.getByLabel('Lesson title').fill('Testing clustered routes');
  await page.getByRole('slider', { name: 'Clustering' }).fill('70');
  await page.getByRole('button', { name: 'Copy lesson link' }).click();
  const url = await page.evaluate(() => navigator.clipboard.readText());
  expect(url).toContain('lesson=');
  await page.goto(url);
  await expect(page.getByRole('heading', { name: 'Testing clustered routes' })).toBeVisible();
  await expect(page.getByRole('slider', { name: 'Clustering' })).toHaveValue('70');
  await expect(page.getByText(/shared lesson loaded/i)).toBeVisible();
});

test('recovers from a damaged lesson URL', async ({ page }) => {
  await page.goto('/?lesson=not-a-valid-preset');
  await expect(page.getByText(/lesson link was damaged/i)).toBeVisible();
  await expect(page.getByRole('heading', { name: 'How local choices shape a route' })).toBeVisible();
});

test('keeps the previous exact value and announces a blank numeric entry', async ({ page }) => {
  await page.goto('/');
  const cities = page.getByRole('spinbutton', { name: 'Cities exact value' });
  await cities.fill('12');
  await cities.dispatchEvent('change');
  await expect(cities).toHaveValue('12');
  await cities.fill('');
  await cities.dispatchEvent('change');
  await expect(cities).toHaveValue('12');
  await expect(page.locator('#error-cities')).toHaveText('Cities needs a number from 5 to 16. The previous value was kept.');
  await expect(page.locator('#error-cities')).toBeVisible();
});

test('downloads the displayed data as CSV before confirming success', async ({ page }) => {
  await page.goto('/?demo=1#workbench');
  await page.getByRole('button', { name: /projectile motion/i }).click();

  const headers = await page.locator('#data-table thead th').allTextContents();
  const rows = await page.locator('#data-table tbody tr').evaluateAll((tableRows) => tableRows.map((row) =>
    Array.from(row.querySelectorAll('td'), (cell) => cell.textContent ?? '')
  ));
  const quote = (value: string) => `"${value.replaceAll('"', '""')}"`;
  const expectedCsv = [headers, ...rows].map((row) => row.map(quote).join(',')).join('\n');

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export data as CSV' }).click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toBe('projectile-seed-41723.csv');
  const downloadPath = await download.path();
  expect(downloadPath).not.toBeNull();
  expect(await readFile(downloadPath!, 'utf8')).toBe(expectedCsv);
  await expect(page.locator('#toast')).toHaveText('CSV exported with the values currently shown.');
});

test('precaches the shell and reopens it in mobile offline emulation', async ({ context, page }, testInfo) => {
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await expect(page.locator('#connection-status')).toContainText('Ready online');
  await page.waitForFunction(async () => {
    const sources = [
      document.querySelector<HTMLScriptElement>('script[type="module"]')?.src,
      document.querySelector<HTMLLinkElement>('link[rel="stylesheet"]')?.href
    ].filter(Boolean) as string[];
    const responses = await Promise.all(sources.map((source) => caches.match(source)));
    const sizes = await Promise.all(responses.map((response) => response?.clone().arrayBuffer().then((body) => body.byteLength) ?? 0));
    return responses.length === 2 && responses.every(Boolean) && sizes.every((size) => size > 0);
  });
  // Playwright's desktop CDP offline toggle bypasses active service workers intermittently;
  // cache integrity is asserted above, and the Chromium mobile profile verifies the reload.
  if (testInfo.project.name === 'chromium') return;
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  // This status is initialized in the HTML shell, before the cached module
  // finishes booting, so an offline reload cannot be left at “Checking”.
  await expect(page.locator('#connection-status')).toContainText('Offline');
  await expect(page.locator('#parameter-controls input')).toHaveCount(6);
  await expect(page.getByRole('heading', { name: /test how one parameter/i })).toBeVisible();
});
