import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

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

test('keeps the product facts in the first desktop and mobile viewport', async ({ page }) => {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    for (const fact of ['Three bounded models', 'No account or payment', 'Works offline after first visit']) {
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

test('keeps legal and not-found routes free of serious accessibility violations', async ({ page }) => {
  for (const route of ['/privacy/', '/terms/', '/404.html']) {
    await page.goto(route);
    const results = await new AxeBuilder({ page: page as never }).analyze();
    expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? '')), route).toEqual([]);
  }
});
