(function() {
    'use strict';

    function preventHangingPrepositions(text) {
        if (!text) return '';
        const prepositions = [
            'в', 'на', 'под', 'над', 'к', 'у', 'от', 'из', 'с', 'по', 'о', 'об', 'за', 'без', 'до', 'для', 'при', 'про',
            'через', 'сквозь', 'между', 'перед', 'вокруг', 'около', 'кроме', 'вместо', 'среди', 'вдоль', 'вследствие',
            'благодаря', 'согласно', 'вопреки', 'ко', 'со', 'во', 'ко', 'и', 'что', 'ок', 'не', 'я', 'их', 'а'
        ];
        const prepositionsRegex = new RegExp(`(\\s|^)(${prepositions.join('|')})(\\s)`, 'gi');
        return text.replace(prepositionsRegex, '$1$2\u00A0');
    }

    function applyPrepositions() {
        const selectors = [
            '.resume-public-list-description',
            '.resume-public-list-subtitle',
            '.resume-public-about',
            '.resume-public-position',
            '.resume-public-list-title'
        ];

        selectors.forEach(function(selector) {
            const elements = document.querySelectorAll(selector);
            elements.forEach(function(element) {
                if (element.textContent) {
                    element.innerHTML = preventHangingPrepositions(element.innerHTML);
                }
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyPrepositions);
    } else {
        applyPrepositions();
    }
})();
