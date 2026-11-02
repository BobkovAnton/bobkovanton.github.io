// Render only the local CV snapshot as a PDF; no external website is opened.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

async function main() {
  const { default: puppeteer } = await import('puppeteer-core');
  const { default: chromium } = await import('@sparticuz/chromium');
  process.stdin.setEncoding('utf8');
  let input = '';
  for await (const chunk of process.stdin) input += chunk;
  const snapshot = JSON.parse(input);
  const root = path.resolve(__dirname, '..');
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'anton-cv-pdf-'));
  const file = path.join(folder, 'cv.html');
  const base = pathToFileURL(root + path.sep).href;
  const style = fs.readFileSync(path.join(root, 'static/css/resume_print.css'), 'utf8');
  fs.writeFileSync(file, snapshot.html.replace('<head>', '<head><base href="' + base + '">').replace('</head>', '<style>' + style + '</style></head>'));
  let browser;
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 960 });
    await page.goto(pathToFileURL(file).href, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const missing = await page.evaluate(() => [...document.images].filter(img => !img.complete || !img.naturalWidth).map(img => img.src));
    if (missing.length) throw new Error('Missing PDF images: ' + missing.join(', '));
    const data = await page.pdf({ format: 'A4', preferCSSPageSize: true, printBackground: true, tagged: true });
    await new Promise((resolve, reject) => process.stdout.write(Buffer.from(data), error => error ? reject(error) : resolve()));
  } finally {
    if (browser) await browser.close();
    fs.rmSync(folder, { recursive: true, force: true });
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
