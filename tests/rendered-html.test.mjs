import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders Zuhayr's portfolio shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Zuhayr Huseni - Software engineer<\/title>/i);
  assert.match(html, /Software engineer working across payments, AI, and developer infrastructure/i);
  assert.match(html, /About me\./i);
  assert.match(html, /full-stack products[\s\S]*AI-powered CRM automation/i);
  assert.match(html, /sales automation software for an industrial engineering company/i);
  assert.doesNotMatch(html, /manufacturing software/i);
  assert.match(html, /traveled to 35 countries/i);
  assert.match(html, /French horn in a concert band/i);
  assert.match(html, /Greater Boston area[\s\S]*San Francisco Bay Area/i);
  assert.match(html, /traveled to Japan to perform with the group/i);
  assert.match(html, /half a year studying in London/i);
  assert.match(html, /YouTube channels, app development, and skiing/i);
  assert.match(html, /Personal tech interests/i);
  assert.match(html, /Human-computer interaction[\s\S]*Developer tools[\s\S]*AI-native marketing/i);
  assert.match(html, /We built this for the University of Connecticut/i);
  assert.match(html, /Forms \+ Surfaces[\s\S]*University of Connecticut/i);
  assert.match(html, /Georgia Institute of Technology[\s\S]*University of Connecticut/i);
  assert.match(html, /Host Family Stay/i);
  assert.doesNotMatch(html, /STACK MATRIX|active tool register|register marks/i);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("keeps content typed and removes the starter preview", async () => {
  const [content, page, layout, styles, packageJson] = await Promise.all([
    readFile(new URL("../app/content.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(content, /export type Experience/);
  assert.match(content, /title: "Test-data CLI"/);
  assert.match(content, /title: "Production operations"/);
  assert.match(content, /company: "Forms \+ Surfaces"[\s\S]*id: "uconn"/);
  assert.match(page, /<Portfolio \/>/);
  assert.match(layout, /Zuhayr Huseni - Software engineer/);
  assert.match(layout, /favicon\.svg\?v=3/);
  assert.match(layout, /favicon-32x32\.png\?v=3/);
  assert.match(layout, /favicon\.ico\?v=3/);
  assert.match(layout, /apple-touch-icon\.png\?v=3/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(styles, /\.stack-row|\.metric-band|architecture-stage/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)));
  await access(new URL("../public/Zuhayr-Huseni-Resume.pdf", import.meta.url));
  await access(new URL("../public/favicon-32x32.png", import.meta.url));
  await access(new URL("../public/favicon.ico", import.meta.url));
  await access(new URL("../public/apple-touch-icon.png", import.meta.url));
  await access(new URL("../public/brands/propel-flow.png", import.meta.url));
});
