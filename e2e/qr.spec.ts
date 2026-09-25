import { expect, test, type Page } from "@playwright/test";
import jsQR from "jsqr";
import { PNG } from "pngjs";
import { readFile } from "node:fs/promises";

async function generate(page: Page, url: string) {
  await page.getByLabel("URL", { exact: true }).fill(url);
  await page.getByRole("button", { name: "Generate QR Code" }).click();
  await expect(page.getByTestId("qr-result")).toBeVisible();
}

async function decodePng(path: string) {
  const png = PNG.sync.read(await readFile(path));
  return jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("shows the empty state and has correct metadata", async ({ page }) => {
  await expect(page).toHaveTitle(/QR Code Generator/);
  await expect(page.getByText("No QR codes generated yet. Create your first one above!")).toBeVisible();
  await expect(page.getByRole("button", { name: "Generate QR Code" })).toBeDisabled();
});

test("validates input", async ({ page }) => {
  await page.getByLabel("URL", { exact: true }).fill("javascript:alert(1)");
  await page.getByRole("button", { name: "Generate QR Code" }).click();
  await expect(page.getByText("Invalid URL", { exact: true })).toBeVisible();
  await expect(page.getByTestId("qr-result")).toHaveCount(0);
});

test("generates, persists history and survives reload", async ({ page }) => {
  await generate(page, "example.com");
  await expect(page.getByText("Scan this QR code to visit:")).toContainText("https://example.com");
  const history = page.getByTestId("qr-history");
  await expect(history.getByText("1 QR code generated")).toBeVisible();

  await generate(page, "https://nextjs.org");
  await expect(history.getByText("2 QR codes generated")).toBeVisible();

  await page.reload();
  await expect(history.getByText("2 QR codes generated")).toBeVisible();
  await expect(history.getByText("https://nextjs.org")).toBeVisible();
});

test("downloads a real PNG that decodes back to the URL", async ({ page }) => {
  await generate(page, "https://example.com/hello?x=1");
  await page.getByRole("button", { name: /Download QR Code/ }).click();
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("menuitem", { name: "PNG image" }).click(),
  ]);
  expect(download.suggestedFilename()).toMatch(/^qr-example\.com-\d{8}-\d{4}\.png$/);
  const path = await download.path();
  const code = await decodePng(path);
  expect(code?.data).toBe("https://example.com/hello?x=1");
});

test("downloads an SVG", async ({ page }) => {
  await generate(page, "https://example.com");
  await page.getByRole("button", { name: /Download QR Code/ }).click();
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("menuitem", { name: "SVG vector" }).click(),
  ]);
  expect(download.suggestedFilename()).toMatch(/\.svg$/);
  const text = await readFile(await download.path(), "utf-8");
  expect(text).toContain("<svg");
});

test("customized colours still decode, and history download works", async ({ page }) => {
  await page.getByLabel("Foreground hex value").fill("#1e3a8a");
  await page.getByLabel("Dot style").click();
  await page.getByRole("option", { name: "Rounded", exact: true }).click();
  await generate(page, "https://redlimesolutions.com");

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Download PNG" }).first().click(),
  ]);
  const code = await decodePng(await download.path());
  expect(code?.data).toBe("https://redlimesolutions.com");
});

test("delete with undo, and clear all", async ({ page }) => {
  await generate(page, "https://a.example.com");
  await generate(page, "https://b.example.com");
  const history = page.getByTestId("qr-history");

  await history.getByRole("button", { name: "Delete" }).first().click();
  await expect(history.getByText("1 QR code generated")).toBeVisible();
  await page.getByRole("button", { name: "Undo" }).click();
  await expect(history.getByText("2 QR codes generated")).toBeVisible();

  await history.getByRole("button", { name: "Clear" }).click();
  await page.getByRole("button", { name: "Clear history" }).click();
  await expect(page.getByText("No QR codes generated yet. Create your first one above!")).toBeVisible();
});

test("legal pages load", async ({ page }) => {
  await page.getByRole("link", { name: "Privacy Policy" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Privacy Policy" })).toBeVisible();
  await page.getByRole("link", { name: "Terms of Service" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Terms of Service" })).toBeVisible();
});

test("a centre logo still decodes", async ({ page }) => {
  // Build a small solid-colour PNG logo on the fly.
  const logo = new PNG({ width: 64, height: 64 });
  for (let i = 0; i < logo.data.length; i += 4) logo.data.set([220, 38, 38, 255], i);
  await page.locator('input[type="file"]').setInputFiles({
    name: "logo.png",
    mimeType: "image/png",
    buffer: PNG.sync.write(logo),
  });
  await expect(page.getByAltText("Selected logo")).toBeVisible();
  await generate(page, "https://example.com/with-logo");

  await page.getByRole("button", { name: /Download QR Code/ }).click();
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("menuitem", { name: "PNG image" }).click(),
  ]);
  const code = await decodePng(await download.path());
  expect(code?.data).toBe("https://example.com/with-logo");
});
