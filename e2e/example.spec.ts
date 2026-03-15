import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://umaxica.net/');

  // Expect the title to contain "UMAXICA".
  await expect(page).toHaveTitle(/UMAXICA/);
});

test('about page has UMAXICA', async ({ page }) => {
  await page.goto('https://umaxica.net/about');

  await expect(page.getByText('About this site.')).toBeVisible();
});

test('top page footer has copyright', async ({ page }) => {
  await page.goto('https://umaxica.net/');

  await expect(page.locator('footer').getByText('© 2026 UMAXICA')).toBeVisible();
});

test('about page footer has copyright', async ({ page }) => {
  await page.goto('https://umaxica.net/about');

  await expect(page.locator('footer').getByText('© 2026 UMAXICA')).toBeVisible();
});
