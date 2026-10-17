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
            if (codeSpan) {
                codeSpan.textContent = level;
            }
            if (descSpan && desc) {
                descSpan.textContent = ' — ' + desc;
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyLanguageLevels);
    } else {
        applyLanguageLevels();
    }
})();

