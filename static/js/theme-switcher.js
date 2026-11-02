(function () {
  'use strict';

  function readTheme() {
    try {
      return localStorage.getItem('theme');
    } catch (error) {
      return null;
    }
  }

  function applyTheme(theme, persist) {
    var html = document.documentElement;
    var isDark = theme !== 'light';
    var resolved = isDark ? 'dark' : 'light';
    var background = isDark ? '#151515' : '#F3F3F3';
    html.classList.toggle('dark-theme', isDark);
    html.classList.toggle('dark-init', isDark);
    html.style.backgroundColor = background;
    html.style.colorScheme = resolved;
    var meta = document.getElementById('meta-theme-color');
    if (meta) meta.setAttribute('content', background);
    document.querySelectorAll('.theme-switcher, .theme-toggle').forEach(function (button) {
      button.setAttribute('aria-pressed', String(isDark));
    });
    if (persist) {
      try {
        localStorage.setItem('theme', resolved);
      } catch (error) {}
    }
  }

  function initTheme() {
    applyTheme(readTheme(), false);
    document.querySelectorAll('.theme-switcher, .theme-toggle').forEach(function (button) {
      button.addEventListener('click', function () {
        applyTheme(document.documentElement.classList.contains('dark-theme') ? 'light' : 'dark', true);
        button.blur();
      });
    });
    window.addEventListener('storage', function (event) {
      if (event.key === 'theme' || event.key === null) applyTheme(readTheme(), false);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme, { once: true });
  } else {
    initTheme();
  }
})();
