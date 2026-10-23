(function () {
    'use strict';

    function applyAchievements() {
        if (!window.ResumeAchievements || !window.ResumeAchievements.parseDescription) return;
        var blocks = document.querySelectorAll('.resume-public-achievement-desc');
        blocks.forEach(function (el) {
            var raw = el.textContent || '';
            var parsed = window.ResumeAchievements.parseDescription(raw);
            if (!parsed.text && (!parsed.achievements || !parsed.achievements.length)) return;

            var container = document.createElement('div');

            if (parsed.text) {
                var p = document.createElement('p');
                p.textContent = parsed.text;
                container.appendChild(p);
            }

            if (parsed.achievements && parsed.achievements.length) {
                var normalizedAchievements = parsed.achievements
                    .map(function (item) {
                        return (item || '').trim().replace(/[;.,]+$/, '');
                    })
                    .filter(Boolean);

                if (normalizedAchievements.length) {
                    var list = document.createElement('div');
                    list.className = 'resume-public-achievements-list';
                    normalizedAchievements.forEach(function (item, index) {
                        var li = document.createElement('div');
                        li.className = 'resume-public-achievements-item';
                        var isLast = index === normalizedAchievements.length - 1;
                        li.textContent = '• ' + item + (isLast ? '.' : ';');
                        list.appendChild(li);
                    });
                    container.appendChild(list);
                }
            }

            el.innerHTML = '';
            el.appendChild(container);
        });
    }


    window.applyAchievements = applyAchievements;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyAchievements);
    } else {
        applyAchievements();
    }
})();
