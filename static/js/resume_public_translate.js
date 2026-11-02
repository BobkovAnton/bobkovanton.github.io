(function () {
    'use strict';

    var LANGUAGE_LEVELS_EN = {
        'A1': 'Beginner', 'A2': 'Elementary', 'B1': 'Intermediate',
        'B2': 'Upper-Intermediate', 'C1': 'Advanced', 'C2': 'Proficient',
        'Свободное владение': 'Fluent'
    };

    function translateLanguageLevels() {
        document.querySelectorAll('.resume-public-language-line').forEach(function (row) {
            var level = (row.getAttribute('data-level') || '').trim();
            if (!level) return;
            var descSpan = row.querySelector('.resume-public-language-desc');
            if (descSpan && LANGUAGE_LEVELS_EN[level]) {
                descSpan.textContent = ' — ' + LANGUAGE_LEVELS_EN[level];
            }
        });
    }

    function init() {
        var publishedLang = window.ResumeConfig && window.ResumeConfig.publishedLang;

        if (publishedLang === 'en') {

            setTimeout(function () {
                translateLanguageLevels();
                if (window.applyAchievements) {
                    window.applyAchievements();
                }
            }, 200);
        }
    }

    if (document.readyState === 'complete') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();
