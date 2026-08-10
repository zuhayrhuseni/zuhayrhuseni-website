import { chromium } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const source = await readFile(resolve("public/favicon.svg"), "utf8");
const browser = await chromium.launch({ headless: true });

for (const [size, filename] of [
  [32, "favicon-32x32.png"],
  [180, "apple-touch-icon.png"],
]) {
  const page = await browser.newPage({
    viewport: { width: size, height: size },
    deviceScaleFactor: 1,
  });

  await page.setContent(
    `<style>html,body{margin:0;width:${size}px;height:${size}px;overflow:hidden}svg{display:block;width:${size}px;height:${size}px}</style>${source}`,
  );
  await page.screenshot({ path: resolve("public", filename) });
  await page.close();
}

await browser.close();
