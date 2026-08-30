import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const appOrigin = new URL(process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4173').origin;

test('names the audience and exposes the one-click sample action', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Test how one parameter changes a model' })).toBeVisible();
  await expect(page.getByText(/for teachers and self-learners/i)).toBeVisible();
  const sample = page.getByRole('link', { name: /try it with sample data/i });
  await expect(sample).toHaveAttribute('href', '/?demo=1#workbench');
  await sample.click();
  await expect(page).toHaveTitle('Demo — Parameter Playground');
  await expect(page.getByText('Demo — sample data, nothing is saved', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Lesson title')).toHaveValue('How clustering changes a delivery route');
  await expect(page.getByRole('heading', { name: 'Build a model lesson' })).toBeInViewport();
  await expect(page.getByRole('heading', { level: 1 })).not.toBeInViewport();
});

test('opens a direct demo URL with the populated workbench in the first viewport', async ({ page }) => {
  await page.goto('/?demo=1#workbench');
  await expect(page.getByRole('heading', { name: 'Build a model lesson' })).toBeInViewport();
  await expect(page.getByRole('heading', { level: 1 })).not.toBeInViewport();
  await expect(page.getByLabel('Lesson title')).toHaveValue('How clustering changes a delivery route');
  await expect.poll(async () => page.evaluate(() => {
    const bannerBottom = document.querySelector('#demo-banner')!.getBoundingClientRect().bottom;
    const headingTop = document.querySelector('#workbench-title')!.getBoundingClientRect().top;
    return headingTop - bannerBottom;
  })).toBeLessThan(160);
});

test('moves focus to the route heading and announces Demo, Privacy, and Back navigation', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /try it with sample data/i }).click();
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page.locator('#route-announcer')).toHaveText('Demo sample lesson loaded.');

  await page.locator('footer').getByRole('link', { name: 'Privacy' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Privacy' })).toBeFocused();
  await expect(page.locator('#route-announcer')).toHaveText('Privacy loaded.');

  await page.goBack();
  await expect(page).toHaveTitle('Demo — Parameter Playground');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page.locator('#route-announcer')).toHaveText('Demo sample lesson loaded.');

  for (const destination of [
    { route: '/terms/', heading: 'Terms of use', announcement: 'Terms of use loaded.' },
    { route: '/404.html', heading: 'This page does not exist', announcement: 'This page does not exist loaded.' }
  ]) {
    await page.goto(destination.route);
    await expect(page.getByRole('heading', { level: 1, name: destination.heading })).toBeFocused();
    await expect(page.locator('#route-announcer')).toHaveText(destination.announcement);
  }
});

test('uses the reviewed plain-language labels without decorative or public provenance copy', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: () => Promise.reject(new DOMException('Blocked for fallback test', 'NotAllowedError')) }
    });
  });
  await page.goto('/?demo=1#workbench');
  await expect(page.getByRole('button', { name: 'Generate new seed' })).toBeVisible();
  await page.getByText('Assumptions & numeric limits').click();
  await expect(page.locator('#active-limits')).toContainText('This rule is quick, but it may not find the shortest route.');
  await expect(page.getByText('SHEET 01 / REV A')).toHaveCount(0);
  await expect(page.getByText(/opening illustration was generated/i)).toHaveCount(0);

  await page.getByRole('button', { name: 'Copy lesson link' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close share dialog' })).toBeVisible();
});

test('keeps the product facts in the first desktop and mobile viewport', async ({ page }) => {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    for (const fact of ['Drafts are stored in this browser', 'No account or payment', 'Works offline after first visit']) {
      await expect(page.getByText(fact, { exact: true })).toBeInViewport();
    }
    const image = page.locator('.hero-figure img');
    if (viewport.width > 760) {
      const box = await image.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.height / box!.width).toBeCloseTo(2 / 3, 1);
    } else {
      await expect(image).toBeHidden();
    }
  }
});

test('keeps every visible mobile touch target at least 44 by 44 CSS pixels', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?demo=1#workbench');
  const undersized = await page.locator('a, button, input, textarea, select, summary').evaluateAll((elements) => elements.flatMap((element) => {
    const style = getComputedStyle(element);
    const box = element.getBoundingClientRect();
    if (style.display === 'none' || style.visibility === 'hidden' || box.width === 0 || box.height === 0) return [];
    return box.width < 44 || box.height < 44
      ? [{ name: element.getAttribute('aria-label') ?? element.textContent?.trim() ?? element.tagName, width: box.width, height: box.height }]
      : [];
  }));
  expect(undersized).toEqual([]);
});

test('serves the designed not-found page with a real 404 response', async ({ page }) => {
  const response = await page.goto('/this-route-does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page).toHaveTitle('Page not found — Parameter Playground');
  await expect(page.getByRole('heading', { level: 1, name: 'This page does not exist' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Return home' })).toBeVisible();
});

test('supports keyboard-only navigation and slider changes', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to playground' })).toBeFocused();
  const slider = page.getByRole('slider', { name: 'Clustering' });
  await slider.focus();
  const before = Number(await slider.inputValue());
  await page.keyboard.press('ArrowRight');
  expect(Number(await slider.inputValue())).toBeGreaterThan(before);
  await expect(page.locator('#live-update')).toContainText('Route recalculated');
});

test('keeps the starting city within the current city count in every entry path', async ({ page }) => {
  const expectRouteState = async (cities: number, start: number, label: string) => {
    const startRange = page.getByRole('slider', { name: 'Starting city' });
    const startNumber = page.getByRole('spinbutton', { name: 'Starting city exact value' });
    await expect(startRange).toHaveAttribute('max', String(cities));
    await expect(startNumber).toHaveAttribute('max', String(cities));
    await expect(startRange).toHaveValue(String(start));
    await expect(startNumber).toHaveValue(String(start));
    await expect(page.locator('#output-start')).toHaveText(String(start));
    await expect(page.locator('#metrics').getByText('Start').locator('..').locator('strong')).toHaveText(label);
  };

  await page.goto('/?demo=1#workbench');
  await expectRouteState(9, 2, 'B');

  const start = page.getByRole('spinbutton', { name: 'Starting city exact value' });
  await start.fill('2.5');
  await start.dispatchEvent('change');
  await expectRouteState(9, 3, 'C');
  await expect(page.locator('#error-start')).toHaveText('Starting city uses steps of 1. 2.5 was changed to 3.');

  await start.fill('16');
  await start.dispatchEvent('change');
  await expectRouteState(9, 9, 'I');
  await expect(page.locator('#error-start')).toHaveText('Starting city accepts 1 to 9. 16 was changed to 9.');
  await expect(page.locator('#error-start')).toBeVisible();

  const cities = page.getByRole('spinbutton', { name: 'Cities exact value' });
  await cities.fill('5');
  await cities.dispatchEvent('change');
  await expectRouteState(5, 5, 'E');
  await expect(page.locator('#error-start')).toHaveText('Starting city changed to 5 because this route has 5 cities.');

  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expectRouteState(9, 2, 'B');
  await page.getByRole('button', { name: /logistic population growth/i }).click();
  await page.getByRole('button', { name: /nearest-neighbor tour/i }).click();
  await expectRouteState(9, 1, 'A');

  const invalidSharedLesson = await page.evaluate(() => {
    const lesson = {
      template: 'tour', title: 'Contextual bounds', prompt: 'Which city starts?', description: 'Seven labeled cities and their route.',
      seed: 41723, params: { cities: 7, cluster: 30, start: 16 }
    };
    return btoa(JSON.stringify(lesson)).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
  });
  await page.goto(`/?lesson=${invalidSharedLesson}#workbench`);
  await expectRouteState(7, 7, 'G');
  await expect(page.locator('#url-notice')).toContainText('Values outside this model’s limits were replaced.');
});

test('normalizes a fractional seed atomically across the lesson, draft, and shared link', async ({ context, page }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: appOrigin });
  await page.goto('/?demo=1#workbench');

  const seed = page.getByRole('spinbutton', { name: 'Deterministic seed' });
  await seed.fill('2.5');
  await seed.dispatchEvent('change');

  await expect(seed).toHaveValue('3');
  expect(await seed.evaluate((input: HTMLInputElement) => ({
    valid: input.validity.valid,
    stepMismatch: input.validity.stepMismatch
  }))).toEqual({ valid: true, stepMismatch: false });
  await expect(page.locator('#seed-error')).toHaveText('Deterministic seed uses whole numbers. 2.5 was changed to 3.');
  await expect(page.locator('#seed-error')).toBeVisible();
  await expect(page.locator('#drawing-number')).toContainText('Seed: 3');
  await expect(page.locator('#active-limits')).toContainText('Seed: 3.');
  const normalizedRows = await page.locator('#data-table tbody').innerText();

  const storedSeed = await page.evaluate(() => {
    const encoded = localStorage.getItem('demo:parameter-playground-draft')!;
    const padded = encoded.replaceAll('-', '+').replaceAll('_', '/') + '='.repeat((4 - encoded.length % 4) % 4);
    return JSON.parse(atob(padded)).seed as number;
  });
  expect(storedSeed).toBe(3);

  await page.getByRole('button', { name: 'Copy lesson link' }).click();
  const url = await page.evaluate(() => navigator.clipboard.readText());
  const restored = await context.newPage();
  await restored.goto(url);
  await expect(restored.getByRole('spinbutton', { name: 'Deterministic seed' })).toHaveValue('3');
  await expect(restored.locator('#drawing-number')).toContainText('Seed: 3');
  expect(await restored.locator('#data-table tbody').innerText()).toBe(normalizedRows);
});

test('keeps legal and not-found routes free of serious accessibility violations', async ({ page }) => {
  for (const route of ['/privacy/', '/terms/', '/404.html']) {
    await page.goto(route);
    const results = await new AxeBuilder({ page: page as never }).analyze();
    expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? '')), route).toEqual([]);
  }
});
