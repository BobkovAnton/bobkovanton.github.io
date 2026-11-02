(function () {
  'use strict';
  function notify(text) {
    if (typeof window.showToast === 'function') window.showToast(text, 'success');
  }
  async function copyText(text, message) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        var field = document.createElement('textarea');
        field.value = text;
        field.setAttribute('readonly', '');
        field.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;';
        document.body.appendChild(field);
        field.select();
        var copied = document.execCommand('copy');
        field.remove();
        if (!copied) throw new Error('Clipboard unavailable');
      }
      notify(message);
    } catch (error) {
      window.prompt('Скопируйте текст:', text);
    }
  }
  var copyLink = document.getElementById('resumeCopyLinkButton');
  if (copyLink) copyLink.addEventListener('click', function () {
    copyText(window.location.href, 'Ссылка скопирована');
  });
  document.querySelectorAll('.resume-public-email-link').forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      copyText(link.getAttribute('data-email') || link.href.replace(/^mailto:/, ''), 'Скопировано');
    });
  });
})();
