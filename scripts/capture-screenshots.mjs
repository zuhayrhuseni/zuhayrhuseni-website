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

  const runtimeErrors = [];
  page.on("pageerror", (error) => runtimeErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(message.text());
  });

  await page.goto(url, { waitUntil: "networkidle" });
  const pageHealth = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    overflowElements: [...document.querySelectorAll("body *")]
      .map((element) => ({ element, rect: element.getBoundingClientRect() }))
      .filter(({ rect }) => rect.left < -1 || rect.right > window.innerWidth + 1)
      .slice(0, 8)
      .map(({ element, rect }) => `${element.tagName.toLowerCase()}.${element.className || "no-class"} (${Math.round(rect.left)}..${Math.round(rect.right)})`),
    brokenImages: [...document.images]
      .filter((image) => !image.complete || image.naturalWidth === 0)
      .map((image) => image.currentSrc || image.src),
  }));

  if (pageHealth.scrollWidth > pageHealth.clientWidth + 1) {
    throw new Error(`${viewport.name}: horizontal overflow (${pageHealth.scrollWidth}px > ${pageHealth.clientWidth}px): ${pageHealth.overflowElements.join(", ")}`);
  }
  if (pageHealth.brokenImages.length) {
    throw new Error(`${viewport.name}: broken images: ${pageHealth.brokenImages.join(", ")}`);
  }
  if (runtimeErrors.length) {
    throw new Error(`${viewport.name}: browser errors: ${runtimeErrors.join(" | ")}`);
  }

  await page.screenshot({
    path: resolve(outputDir, `${viewport.name}.png`),
    fullPage: true,
  });
  await page.close();
}

await browser.close();
