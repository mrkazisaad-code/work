// Renders every [data-export] element in strip-source/koeos-strips.html to a 2x PNG in assets/.
// Usage (from the repository root): node email-signature-koeos/scripts/render-strips.mjs
import { chromium } from 'playwright-core';
import { mkdirSync, statSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const source = new URL('strip-source/koeos-strips.html', root);
const out = fileURLToPath(new URL('assets/', root));
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage({ deviceScaleFactor: 2 });
await page.goto(source.href);
await page.waitForSelector('body[data-ready="1"]');
// Hide the preview-only backgrounds (checkerboards, page colour) so transparent exports stay transparent
await page.addStyleTag({ content: 'html, body, .checker { background: transparent !important; }' });

const exports = await page.$$eval('[data-export]', (els) => els.map((e) => ({ id: e.id, file: e.dataset.export })));
for (const { id, file } of exports) {
  await page.locator(`#${id}`).screenshot({ path: out + file, omitBackground: true });
}
const wordmark = await page.evaluate(() => window.WORDMARK);
await browser.close();

// Reduce PNGs to an optimised palette (keeps transparency) so they stay small for email
const py = `
import sys
from PIL import Image
for p in sys.argv[1:]:
    im = Image.open(p).convert('RGBA')
    q = im.quantize(colors=128, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.NONE)
    q.save(p, optimize=True)
`;
execFileSync('python3', ['-I', '-c', py, ...exports.map((e) => out + e.file)]);

const report = exports.map(({ file }) => `${file}  ${(statSync(out + file).size / 1024).toFixed(1)} KB`);
writeFileSync(out + 'wordmark-size.json', JSON.stringify({ width: wordmark.width, height: wordmark.height }) + '\n');
console.log(report.join('\n'));
console.log(`wordmark display size: ${wordmark.width} x ${wordmark.height}`);
