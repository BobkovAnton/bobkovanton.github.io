const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

// Run the site's existing text/date formatters without a browser or network.
async function main() {
  const root = path.resolve(__dirname, '..');
  const dom = new JSDOM(fs.readFileSync(path.join(root, 'index.html'), 'utf8'), {
    runScripts: 'outside-only',
    url: 'https://bobkovanton.github.io/',
  });
  if (dom.window.document.readyState === 'loading') {
    await new Promise(resolve => dom.window.document.addEventListener('DOMContentLoaded', resolve, { once: true }));
  }
  const document = dom.window.document;
  dom.window.eval(fs.readFileSync(path.join(root, 'static/js/resume/config.js'), 'utf8'));
  Object.assign(dom.window.ResumeConfig, JSON.parse(document.querySelector('#resume-config-json').textContent));
  for (const script of [
    'static/js/utils/escapeHtml.js',
    'static/js/resume/formatters.js',
    'static/js/resume/achievementsUtils.js',
    'static/js/resume_public_dates.js',
    'static/js/resume_public_lang.js',
    'static/js/resume_public_achievements.js',
    'static/js/resume_public_prepositions.js',
  ]) dom.window.eval(fs.readFileSync(path.join(root, script), 'utf8'));
  const main = document.querySelector('.resume-public-page');
  if (!main || !main.querySelector('.resume-public-card')) {
    throw new Error('Unexpected CV structure; PDF was not generated.');
  }
  for (const item of main.querySelectorAll('.resume-public-list-item')) {
    if (item.querySelector('.resume-public-work-description')) item.classList.add('resume-public-work-item');
  }
  // Remove only inaccessible decorative emoji in the print version. Text and links stay intact.
  for (const title of main.querySelectorAll('.resume-public-section-title')) {
    title.innerHTML = title.innerHTML.replace(/^[^А-ЯA-Za-z<]+/u, '');
    if (/^(Награды|Образование)/u.test(title.textContent.trim())) {
      title.closest('.resume-public-card').classList.add('resume-public-compact-card');
    }
  }
  for (const el of main.querySelectorAll('img[src]')) {
    const src = el.getAttribute('src');
    if (!/^[a-z][a-z0-9+.-]*:/i.test(src)) {
      el.setAttribute('src', path.join(root, src.replace(/^\.\//, '')));
    }
  }
  const typography = document.querySelector('style').textContent;
  process.stdout.write(JSON.stringify({
    html: '<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>Anton Bobkov — Product Designer | CV</title><style>' + typography + '</style></head><body>' + main.outerHTML + '</body></html>',
    headings: [...main.querySelectorAll('.resume-public-section-title, .resume-public-list-title')].map(el => el.textContent.trim()),
    blocks: [...main.querySelectorAll('.resume-public-about, .resume-public-list-description:not(.resume-public-work-description), .resume-public-work-intro, .resume-public-work-points li, .resume-public-language-line, .resume-public-skill-chip:not(.resume-tool-link), .resume-public-certificate-link')].map(el => el.textContent.trim()).filter(Boolean),
    links: [...new Set([...main.querySelectorAll('a[href]')].map(el => el.getAttribute('href')))],
    text: main.textContent,
  }));
  dom.window.close();
}
main().catch(error => { console.error(error); process.exitCode = 1; });
