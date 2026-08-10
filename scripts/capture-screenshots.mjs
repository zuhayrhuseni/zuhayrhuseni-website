import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const url = process.env.SITE_URL ?? "http://localhost:3000";
const outputDir = resolve("screenshots");
const viewports = [
  { name: "desktop-1440", width: 1440, height: 1000 },
  { name: "tablet-768", width: 768, height: 1000 },
  { name: "mobile-390", width: 390, height: 844 },
];

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });

for (const viewport of viewports) {
  const page = await browser.newPage({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });

  await page.goto(url, { waitUntil: "networkidle" });
  await page.screenshot({
    path: resolve(outputDir, `${viewport.name}.png`),
    fullPage: true,
  });
  await page.close();
}

await browser.close();
