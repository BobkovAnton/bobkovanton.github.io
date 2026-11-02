(function () {
    'use strict';

    function applyLanguageLevels() {
        if (!window.ResumeConfig || !window.ResumeConfig.LANGUAGE_LEVEL_TEXT) return;
        var publishedLang = window.ResumeConfig.publishedLang || 'ru';
        var map = window.ResumeConfig.getLanguageLevelText
            ? window.ResumeConfig.getLanguageLevelText(publishedLang)
            : window.ResumeConfig.LANGUAGE_LEVEL_TEXT;
        var rows = document.querySelectorAll('.resume-public-language-line');
        rows.forEach(function (row) {
            var level = (row.getAttribute('data-level') || '').trim();
            if (!level) return;
            var desc = map[level];
            var codeSpan = row.querySelector('.resume-public-language-code');
            var descSpan = row.querySelector('.resume-public-language-desc');
            var isRussianNative = publishedLang === 'ru' && level === 'Носитель';
            var isCompactA2 = publishedLang === 'ru' && level === 'A2';
            if (codeSpan) {
                codeSpan.textContent = isRussianNative || isCompactA2 ? '' : level;
            }
            if (descSpan && desc) {
                descSpan.textContent = isRussianNative ? '— родной' : isCompactA2 ? '— A2' : ' — ' + desc;
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyLanguageLevels);
    } else {
        applyLanguageLevels();
    }
})();

