(() => {
  'use strict';
  const image = document.querySelector('#certificate');
  const stage = document.querySelector('#stage');
  const canvas = document.querySelector('#canvas');
  const output = document.querySelector('#zoom-value');
  const plus = document.querySelector('#zoom-in');
  const minus = document.querySelector('#zoom-out');
  let scale = 1;
  let fitted = true;
  let fittedScale = 1;

  function applyTheme(value) {
    const resolved = value === 'light' ? 'light' : 'dark';
    document.documentElement.dataset.theme = resolved;
    document.querySelector('meta[name="theme-color"]').content = resolved === 'dark' ? '#151515' : '#f3f3f3';
  }
  try { applyTheme(localStorage.getItem('theme')); } catch { applyTheme('dark'); }
  window.addEventListener('storage', event => {
    if (event.key === 'theme' || event.key === null) applyTheme(event.newValue);
  });

  function calculateFit() {
    const padding = Number.parseFloat(getComputedStyle(canvas).paddingLeft) * 2;
    return Math.max(.05, Math.min(1, (stage.clientWidth - padding) / image.naturalWidth, (stage.clientHeight - padding) / image.naturalHeight));
  }
  function render(next, mode = false) {
    if (!image.naturalWidth) return;
    const oldWidth = Math.max(1, stage.scrollWidth);
    const oldHeight = Math.max(1, stage.scrollHeight);
    const centerX = (stage.scrollLeft + stage.clientWidth / 2) / oldWidth;
    const centerY = (stage.scrollTop + stage.clientHeight / 2) / oldHeight;
    scale = Math.max(.05, Math.min(2, next));
    fitted = mode;
    const padding = Number.parseFloat(getComputedStyle(canvas).paddingLeft) * 2;
    image.style.width = `${image.naturalWidth * scale}px`;
    image.style.maxHeight = 'none';
    canvas.style.minWidth = `max(100%, ${image.naturalWidth * scale + padding}px)`;
    output.value = `${Math.round(scale * 100)}%`;
    output.textContent = output.value;
    stage.classList.toggle('is-zoomed', !fitted);
    plus.disabled = scale >= 2;
    minus.disabled = scale <= .05;
    requestAnimationFrame(() => {
      stage.scrollLeft = fitted ? 0 : centerX * stage.scrollWidth - stage.clientWidth / 2;
      stage.scrollTop = fitted ? 0 : centerY * stage.scrollHeight - stage.clientHeight / 2;
    });
  }
  function fitImage() { fittedScale = calculateFit(); render(fittedScale, true); }
  plus.addEventListener('click', () => render(scale * 1.25));
  minus.addEventListener('click', () => render(scale / 1.25));
  image.addEventListener('click', () => fitted ? render(1) : fitImage());
  document.addEventListener('keydown', event => {
    if (event.ctrlKey || event.metaKey || event.altKey || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return;
    if (event.key === '+' || event.key === '=') { event.preventDefault(); render(scale * 1.25); }
    if (event.key === '-') { event.preventDefault(); render(scale / 1.25); }
    if (event.key === '0' || event.key === 'Escape') { event.preventDefault(); fitImage(); }
  });
  image.addEventListener('load', fitImage);
  if (image.complete && image.naturalWidth) fitImage();
  new ResizeObserver(() => { if (fitted && image.naturalWidth) fitImage(); }).observe(stage);
})();
