import { expect, test } from "@playwright/test";

// 認証情報なしで検証できること — CI が常時回すのはこのスイート。
//
// 対象ホストは Cloudflare Access の背後にあるため中身は見られないが、
// 「到達でき、かつ Access のログイン画面が返る」ことは外側から確認できる。
// これは可用性の確認であると同時に、Access の保護が意図せず外れたことを
// 検知するトリップワイヤーでもある。
// （ホストを意図的に公開する場合は、そのホストを PROTECTED_HOSTS から
//   外して public.spec.ts 側に実コンテンツの検査を書くこと。）

const PROTECTED_HOSTS = [
  "umaxica.com",
  "umaxica.org",
  "umaxica.app",
  "umaxica.net",
  "jp.umaxica.com",
  "jp.umaxica.org",
  "jp.umaxica.app",
];

for (const host of PROTECTED_HOSTS) {
  test(`${host} は到達でき Cloudflare Access で保護されている`, async ({ page }) => {
    const response = await page.goto(`https://${host}/`);

    expect(response?.status()).toBeLessThan(400);
    await expect(page).toHaveTitle(/Cloudflare Access/);
  });
}

// FIXME: www.umaxica.dev は 2026-08-25 時点で 404 (未デプロイ)。
// 公開後に fixme を外し、実コンテンツの検査に置き換える。
test.fixme("www.umaxica.dev は公開されている", async ({ page }) => {
  const response = await page.goto("https://www.umaxica.dev/");

  expect(response?.status()).toBeLessThan(400);
  await expect(page).not.toHaveTitle(/Cloudflare Access/);
  await expect(page.locator("body")).not.toBeEmpty();
});
