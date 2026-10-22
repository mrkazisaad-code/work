// Preview screenshots of each signature: white and simulated dark mode, desktop (640px) and 375px.
// Usage (from the repository root): node email-signature-koeos/scripts/render-previews.mjs
// Images are loaded from assets/ locally (the live copies are served from https://koeos.io/email/).
// The dark preview simulates full colour inversion, as Gmail apps and Outlook dark mode apply it;
// images are not inverted, matching those clients.
import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = new URL('../', import.meta.url);
const config = JSON.parse(readFileSync(new URL('config/signatures.json', root), 'utf8'));
const assets = pathToFileURL(fileURLToPath(new URL('assets/', root))).href;
const out = fileURLToPath(new URL('previews/', root));
const tmp = out + '_tmp/';
mkdirSync(tmp, { recursive: true });

const DARK = `<style>
  html { background: #ffffff; }
  body { filter: invert(1) hue-rotate(180deg); }
  img { filter: invert(1) hue-rotate(180deg); }
</style>`;

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const jobs = [];
for (const p of config.people) {
  jobs.push({ slug: p.slug, file: `${p.slug}.html`, label: '' });
  jobs.push({ slug: p.slug, file: `${p.slug}-with-strip.html`, label: '-with-strip' });
}
for (const job of jobs) {
  const html = readFileSync(new URL(`signatures/${job.file}`, root), 'utf8').replaceAll(config.assets.baseUrl, assets);
  for (const mode of ['white', 'dark']) {
    const file = `${tmp}${job.slug}${job.label}-${mode}.html`;
    writeFileSync(file, mode === 'dark' ? html.replace('</head>', `${DARK}</head>`) : html);
    for (const width of [640, 375]) {
      const page = await browser.newPage({ viewport: { width, height: 600 }, deviceScaleFactor: 2 });
      await page.goto(pathToFileURL(file).href);
      await page.waitForLoadState('networkidle');
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      const h = await page.evaluate(() => document.querySelector('table').getBoundingClientRect().bottom + 24);
      const name = `${job.slug}${job.label}-${mode}-${width === 640 ? 'desktop' : '375'}.png`;
      await page.screenshot({ path: out + name, clip: { x: 0, y: 0, width, height: Math.ceil(h) } });
      if (overflow > 0) console.warn(`  horizontal overflow ${overflow}px: ${name}`);
      await page.close();
    }
  }
  console.log(`previews/${job.slug}${job.label}-{white,dark}-{desktop,375}.png`);
}
// Images blocked: the signature must read completely without them (alt text shows instead)
{
  const page = await browser.newPage({ viewport: { width: 640, height: 600 }, deviceScaleFactor: 2 });
  await page.route('**/*.png', (r) => r.abort());
  await page.goto(pathToFileURL(`${tmp}qazi-saad-khan-with-strip-white.html`).href);
  const h = await page.evaluate(() => document.querySelector('table').getBoundingClientRect().bottom + 24);
  await page.screenshot({ path: out + 'qazi-saad-khan-images-blocked.png', clip: { x: 0, y: 0, width: 640, height: Math.ceil(h) } });
  await page.close();
  console.log('previews/qazi-saad-khan-images-blocked.png');
}
await browser.close();
rmSync(tmp, { recursive: true, force: true });
