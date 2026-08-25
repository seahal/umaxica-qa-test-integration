import { test, expect, type Page } from "@playwright/test";

// 対象サイトは全て Cloudflare Access の背後にある。
// service token が無いと全リクエストが Access のログイン画面 (HTTP 200) に差し替わり、
// 「status < 400」「body が空でない」といった検査が偽陽性で通ってしまう。
// そのため token 未設定時はスイート全体をスキップする。
const hasAccessToken = Boolean(
  process.env.CF_ACCESS_CLIENT_ID && process.env.CF_ACCESS_CLIENT_SECRET,
);

test.skip(
  !hasAccessToken,
  "CF_ACCESS_CLIENT_ID / CF_ACCESS_CLIENT_SECRET が未設定のため実行できません (Cloudflare Access service token が必要)",
);

// Access のログイン画面を掴んでいないことを保証する。
async function expectNotAccessLogin(page: Page) {
  await expect(page).not.toHaveTitle(/Cloudflare Access/);
}

test("has title", async ({ page }) => {
  await page.goto("https://umaxica.net/");

  // Expect the title to contain "UMAXICA".
  await expect(page).toHaveTitle(/UMAXICA/);
});

test("about page has UMAXICA", async ({ page }) => {
  const response = await page.goto("https://umaxica.net/about");

  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(/UMAXICA/);
  await expect(page.getByText("About this site.")).toBeVisible();
});

test("top page footer has copyright", async ({ page }) => {
  await page.goto("https://umaxica.net/");

  await expect(page.locator("footer").getByText(/©\s*\d{4}\s+UMAXICA/)).toBeVisible();
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
    await expectNotAccessLogin(page);
  });
}

// FIXME: www.umaxica.dev は 2026-08-25 時点で 404 (未デプロイ)。公開後に fixme を外す。
test.fixme("www.umaxica.dev exists", async ({ page }) => {
  const response = await page.goto("https://www.umaxica.dev/");

  expect(response?.status()).toBeLessThan(400);
  await expectNotAccessLogin(page);
});

// Health check tests — apex domains
for (const domain of ["umaxica.com", "umaxica.org", "umaxica.app", "umaxica.net"]) {
  test(`${domain} /health returns ok`, async ({ page }) => {
    const response = await page.goto(`https://${domain}/health`);

    expect(response?.status()).toBe(200);
    await expectNotAccessLogin(page);
  });
}

// Health check tests — core subdomain apps
for (const domain of ["jp.umaxica.com", "jp.umaxica.org", "jp.umaxica.app"]) {
  test(`${domain} /health returns ok`, async ({ page }) => {
    const response = await page.goto(`https://${domain}/health`);

    expect(response?.status()).toBe(200);
    await expectNotAccessLogin(page);
  });
}

// umaxica.net page content tests
test("umaxica.net homepage renders content", async ({ page }) => {
  await page.goto("https://umaxica.net/");

  await expect(page).toHaveTitle(/UMAXICA/);
  await expectNotAccessLogin(page);
  await expect(page.locator("body")).not.toBeEmpty();
});

test("umaxica.net about page renders content", async ({ page }) => {
  await page.goto("https://umaxica.net/about");

  await expect(page.getByText("About this site.")).toBeVisible();
});

// jp.umaxica.app route tests (Timeline/Social Feed App)
for (const route of [
  { path: "/", name: "Home/Timeline" },
  { path: "/configuration/", name: "Configuration" },
  { path: "/configuration/account", name: "Account settings" },
  { path: "/configuration/preference", name: "Preference settings" },
  { path: "/message/", name: "Messages" },
  { path: "/notification/", name: "Notifications" },
  { path: "/explore/", name: "Explore" },
  { path: "/authentication/", name: "Authentication" },
]) {
  test(`jp.umaxica.app ${route.name} page loads`, async ({ page }) => {
    const response = await page.goto(`https://jp.umaxica.app${route.path}`);

    expect(response?.status()).toBeLessThan(400);
    await expectNotAccessLogin(page);
    await expect(page.locator("body")).not.toBeEmpty();
  });
}

// jp.umaxica.com route tests (Corporate Site)
for (const route of [
  { path: "/", name: "Homepage" },
  { path: "/explore/", name: "Explore" },
]) {
  test(`jp.umaxica.com ${route.name} page loads`, async ({ page }) => {
    const response = await page.goto(`https://jp.umaxica.com${route.path}`);

    expect(response?.status()).toBeLessThan(400);
    await expectNotAccessLogin(page);
    await expect(page.locator("body")).not.toBeEmpty();
  });
}

// jp.umaxica.org route tests (Community/Events Site)
for (const route of [
  { path: "/", name: "EventList" },
  { path: "/configure", name: "Configuration" },
  { path: "/sample", name: "Sample" },
]) {
  test(`jp.umaxica.org ${route.name} page loads`, async ({ page }) => {
    const response = await page.goto(`https://jp.umaxica.org${route.path}`);

    expect(response?.status()).toBeLessThan(400);
    await expectNotAccessLogin(page);
    await expect(page.locator("body")).not.toBeEmpty();
  });
}

test("jp.umaxica.org returns 404 for non-existent route", async ({ page }) => {
  const response = await page.goto("https://jp.umaxica.org/this-route-does-not-exist");

  expect(response?.status()).toBe(404);
});

// www.umaxica.dev route tests (Dev/Docs Site)
// FIXME: 同上 — www.umaxica.dev の公開後に fixme を外す。
test.fixme("www.umaxica.dev docs page loads", async ({ page }) => {
  const response = await page.goto("https://www.umaxica.dev/");

  expect(response?.status()).toBeLessThan(400);
  await expectNotAccessLogin(page);
  await expect(page.locator("body")).not.toBeEmpty();
});
