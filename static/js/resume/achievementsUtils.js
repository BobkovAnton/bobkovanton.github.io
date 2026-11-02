(function () {
    'use strict';

    function parseDescription(description) {
        const raw = description || '';
        const parts = raw.split('__ACHIEVEMENTS__');
        let text = (parts[0] || '').trim();
        let achievements = [];


        if (parts[1]) {
            try {
                achievements = JSON.parse(parts[1].trim()) || [];
            } catch (e) {
                achievements = [];
            }
        }


        if (!achievements.length && raw.indexOf('•') !== -1) {
            const segments = raw.split('•')
                .map(function (s) { return (s || '').trim(); })
                .filter(Boolean);
            if (segments.length) {
                text = segments.shift();
                achievements = segments;
            }
        }

        achievements = achievements
            .map(function (item) { return (item || '').trim().replace(/[;.,]+$/, ''); })
            .filter(Boolean);
        return { text: text, achievements: achievements };
    }

    window.ResumeAchievements = {
        parseDescription: parseDescription,
    };
})();
