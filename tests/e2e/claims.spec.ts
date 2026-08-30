import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';

const demoUrl = '/?demo=1#workbench';

test('@claim:demo-isolation keeps sample changes separate and discards them on exit', async ({ page }) => {
  await page.addInitScript(() => {
    const regular = {
      template: 'tour', title: 'My untouched regular lesson', prompt: 'Regular prompt', description: 'Regular description',
      seed: 99, params: { cities: 6, cluster: 10, start: 1 }
    };
    localStorage.setItem('parameter-playground-draft', btoa(JSON.stringify(regular)).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, ''));
  });
  await page.goto(demoUrl);
  await expect(page.getByText('Demo — sample data, nothing is saved', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Lesson title')).toHaveValue('How clustering changes a delivery route');
  await page.getByLabel('Lesson title').fill('Changed sample lesson');
  const regularDraft = await page.evaluate(() => localStorage.getItem('parameter-playground-draft'));
  expect(await page.evaluate(() => localStorage.getItem('demo:parameter-playground-draft'))).toBeTruthy();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByLabel('Lesson title')).toHaveValue('How clustering changes a delivery route');
  expect(await page.evaluate(() => localStorage.getItem('demo:parameter-playground-draft'))).toBeNull();
  await page.getByLabel('Lesson title').fill('Discard this sample');
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page).not.toHaveURL(/demo=1/);
  await expect(page.getByLabel('Lesson title')).toHaveValue('My untouched regular lesson');
  expect(await page.evaluate(() => localStorage.getItem('demo:parameter-playground-draft'))).toBeNull();
  expect(await page.evaluate(() => localStorage.getItem('parameter-playground-draft'))).toBe(regularDraft);
});

test('@claim:three-bounded-models opens all three templates with limits and output', async ({ page }) => {
  await page.goto(demoUrl);
  const models = [
    { name: /nearest-neighbor tour/i, slider: 'Cities', limit: '5–16 cities' },
    { name: /logistic population growth/i, slider: 'Growth rate', limit: '5–30 discrete steps' },
    { name: /projectile motion/i, slider: 'Launch angle', limit: 'Angle 10–80°' }
  ];
  for (const model of models) {
    await page.getByRole('button', { name: model.name }).click();
    await expect(page.getByRole('slider', { name: model.slider })).toBeVisible();
    const unbounded = await page.locator('#parameter-controls input[type="range"]').evaluateAll((inputs) => inputs.filter((input) => !input.hasAttribute('min') || !input.hasAttribute('max')).length);
    expect(unbounded).toBe(0);
    await page.getByText('Assumptions & numeric limits').click();
    await expect(page.locator('#active-limits')).toContainText(model.limit);
    await expect(page.locator('#data-table tbody tr').first()).toBeVisible();
  }
});

test('@claim:deterministic-seed reproduces every displayed value', async ({ page }) => {
  await page.goto(demoUrl);
  await page.getByRole('slider', { name: 'Clustering' }).fill('50');
  const seed = page.getByRole('spinbutton', { name: 'Deterministic seed' });
  await seed.fill('12345');
  await seed.dispatchEvent('change');
  const first = await page.locator('#data-table tbody').innerText();
  await seed.fill('98765');
  await seed.dispatchEvent('change');
  expect(await page.locator('#data-table tbody').innerText()).not.toBe(first);
  await seed.fill('12345');
  await seed.dispatchEvent('change');
  expect(await page.locator('#data-table tbody').innerText()).toBe(first);
});

test('@claim:lesson-editing updates learner copy and the chart text alternative', async ({ page }) => {
  await page.goto(demoUrl);
  await page.getByLabel('Lesson title').fill('Compare tight and loose clusters');
  await page.getByLabel('Prediction prompt').fill('Will tighter clusters shorten this route?');
  await page.getByLabel(/Visual description/).fill('Nine city markers connected by a red route on a coordinate plane.');
  await expect(page.getByRole('heading', { name: 'Compare tight and loose clusters' })).toBeVisible();
  await expect(page.locator('#learner-prompt')).toHaveText('Will tighter clusters shorten this route?');
  await expect(page.locator('#chart-caption')).toContainText('Nine city markers connected by a red route on a coordinate plane.');
});

test('@claim:shareable-preset restores lesson text and parameters from the copied URL', async ({ context, page }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: 'http://127.0.0.1:4173' });
  await page.goto(demoUrl);
  await page.getByLabel('Lesson title').fill('Shared sample route');
  await page.getByRole('slider', { name: 'Clustering' }).fill('75');
  await page.getByRole('button', { name: 'Copy lesson link' }).click();
  const url = await page.evaluate(() => navigator.clipboard.readText());
  expect(url).toContain('/?lesson=');
  expect(url).not.toContain('demo=1');
  const restored = await context.newPage();
  await restored.goto(url);
  await expect(restored.getByLabel('Lesson title')).toHaveValue('Shared sample route');
  await expect(restored.getByRole('slider', { name: 'Clustering' })).toHaveValue('75');
  await expect(restored.getByText(/shared lesson loaded/i)).toBeVisible();
});

test('@claim:csv-export downloads bytes matching the displayed table', async ({ page }) => {
  await page.goto(demoUrl);
  await page.getByRole('button', { name: /projectile motion/i }).click();
  const headers = await page.locator('#data-table thead th').allTextContents();
  const rows = await page.locator('#data-table tbody tr').evaluateAll((tableRows) => tableRows.map((row) =>
    Array.from(row.querySelectorAll('td'), (cell) => cell.textContent ?? '')
  ));
  const quote = (value: string) => `"${value.replaceAll('"', '""')}"`;
  const expected = [headers, ...rows].map((row) => row.map(quote).join(',')).join('\n');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export data as CSV' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('projectile-seed-41723.csv');
  expect(await readFile((await download.path())!, 'utf8')).toBe(expected);
});

test('@claim:local-draft stores regular settings locally and restores them after refresh', async ({ page }) => {
  await page.goto(demoUrl);
  await page.getByRole('link', { name: 'Start for real' }).click();
  await page.getByLabel('Lesson title').fill('My saved local lesson');
  await page.getByRole('slider', { name: 'Clustering' }).fill('55');
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual(['parameter-playground-draft']);
  await page.reload();
  await expect(page.getByLabel('Lesson title')).toHaveValue('My saved local lesson');
  await expect(page.getByRole('slider', { name: 'Clustering' })).toHaveValue('55');
});

test('@claim:no-account-payment completes learner work and opens every model without gates', async ({ page }) => {
  await page.goto(demoUrl);
  await page.getByLabel('My prediction').fill('The route will get shorter.');
  await page.getByRole('button', { name: 'Commit prediction' }).click();
  await page.getByRole('slider', { name: 'Clustering' }).press('ArrowRight');
  await page.getByLabel('and observed').fill('The route length changed.');
  await page.getByRole('button', { name: 'Complete explanation' }).click();
  await expect(page.getByText(/complete: you changed clustering/i)).toBeVisible();
  await page.getByRole('button', { name: /logistic population growth/i }).click();
  await page.getByRole('button', { name: /projectile motion/i }).click();
  await expect(page.locator('input[type="password"], input[type="email"]')).toHaveCount(0);
  await expect(page.locator('a, button').filter({ hasText: /sign in|log in|checkout|buy now/i })).toHaveCount(0);
});

test('@claim:same-origin-privacy sends only same-origin static requests during the demo flow', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto(demoUrl);
  await page.getByRole('button', { name: /logistic population growth/i }).click();
  await page.getByRole('slider', { name: 'Growth rate' }).fill('0.55');
  await page.getByLabel('Lesson title').fill('Private sample change');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export data as CSV' }).click();
  await downloadPromise;
  const unexpected = requests.filter((request) => {
    const url = new URL(request);
    return url.origin !== 'http://127.0.0.1:4173' || !(/^\/(?:$|index\.html$|sw\.js$|favicon\.svg$|apple-touch-icon\.png$|assets\/|fonts\/)/).test(url.pathname);
  });
  expect(unexpected).toEqual([]);
});

test('@claim:offline-reload reopens the sample in a fresh offline context', async ({ browser }) => {
  const context = await browser.newContext({ baseURL: 'http://127.0.0.1:4173', viewport: { width: 390, height: 844 } });
  try {
    const page = await context.newPage();
    await page.goto(demoUrl);
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.reload();
    await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
    await page.waitForFunction(async () => {
      const resources = [
        document.querySelector<HTMLScriptElement>('script[type="module"]')?.src,
        document.querySelector<HTMLLinkElement>('link[rel="stylesheet"]')?.href
      ].filter(Boolean) as string[];
      const cached = await Promise.all(resources.map((resource) => caches.match(resource)));
      return cached.length === 2 && cached.every(Boolean);
    });
    await context.setOffline(true);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('#connection-status')).toContainText('Offline');
    await expect(page.getByText('Demo — sample data, nothing is saved', { exact: true })).toBeVisible();
    await expect(page.locator('#parameter-controls input')).toHaveCount(6);
  } finally {
    await context.close();
  }
});

test('@claim:accessible-inspection exposes narration and semantic data without serious axe violations', async ({ page }) => {
  await page.goto(demoUrl);
  for (const name of [/nearest-neighbor tour/i, /logistic population growth/i, /projectile motion/i]) {
    await page.getByRole('button', { name }).click();
    await expect(page.locator('#simulation-svg title')).not.toBeEmpty();
    await expect(page.locator('#chart-caption')).toContainText('Current result:');
    await expect(page.locator('#data-table caption')).not.toBeEmpty();
    expect(await page.locator('#data-table thead th').count()).toBeGreaterThan(0);
  }
  const results = await new AxeBuilder({ page: page as never }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
});
