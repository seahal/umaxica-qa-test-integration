import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("https://umaxica.net/");

  // Expect the title to contain "UMAXICA".
  await expect(page).toHaveTitle(/UMAXICA/);
});

test("about page has UMAXICA", async ({ page }) => {
  await page.goto("https://umaxica.net/about");
});

test("top page footer has copyright", async ({ page }) => {
  await page.goto("https://umaxica.net/");

  await expect(page.locator("footer").getByText("© 2026 UMAXICA")).toBeVisible();
});

for (const domain of ["umaxica.org", "umaxica.com", "umaxica.app", "umaxica.net"]) {
  test(`${domain} about page has UMAXICA`, async ({ page }) => {
    await page.goto(`https://${domain}/about`);
    await expect(page.getByText("About this site.")).toBeVisible();
  });
}

for (const domain of ["umaxica.org", "umaxica.com", "umaxica.app"]) {
  test(`${domain} top page redirects`, async ({ page }) => {
    await page.goto(`https://${domain}/`);

    // After redirect, the URL should no longer be the original domain
    expect(page.url()).not.toBe(`https://${domain}/`);
  });
}

for (const domain of ["umaxica.org", "umaxica.com", "umaxica.app"]) {
  test(`jp.${domain} exists`, async ({ page }) => {
    const response = await page.goto(`https://jp.${domain}/`);

    expect(response?.status()).toBeLessThan(400);
  });
}

test("www.umaxica.dev exists", async ({ page }) => {
  const response = await page.goto("https://www.umaxica.dev/");

  expect(response?.status()).toBeLessThan(400);
});
