(function () {
    'use strict';

    function sanitizePhoneValue(value) {
        var cleaned = (value || '').replace(/[^\d()+\-\s]/g, '');
        if (!cleaned) return '';
        var hasLeadingPlus = cleaned.charAt(0) === '+';
        cleaned = cleaned.replace(/\+/g, '');
        return (hasLeadingPlus ? '+' : '') + cleaned;
    }

    function formatTelegramValue(value) {
        var val = (value || '').trim();
        if (!val) return '';
        val = val.replace(/^https?:\/\//i, '');
        val = val.replace(/^(t\.me|telegram\.me|telegram\.dog)\//i, '');
        val = val.replace(/^@+/, '');
        val = val.replace(/\/+$/, '');
        val = val.split(/[?#]/)[0];
        return val ? '@' + val : '';
    }

    function normalizeUrlWithHttps(value) {
        var trimmed = (value || '').trim();
        if (!trimmed) return '';
        var withoutProtocol = trimmed.replace(/^(https?:\/\/)+/i, '');
        if (!withoutProtocol) return 'https://';
        return 'https://' + withoutProtocol;
    }

    function isoToDisplay(val) {
        if (!val) return '';
        var m = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(val);
        if (!m) return val;
        return m[2] + '.' + m[1];
    }

    function displayToIso(val) {
        if (!val) return '';
        var m = /^(\d{2})\.(\d{4})$/.exec(val);
        if (!m) return '';
        return m[2] + '-' + m[1] + '-01';
    }

    function formatMonthYear(iso, lang) {
        if (!iso) return '';
        // new Date("YYYY-MM-DD") парсится как UTC: в поясах западнее UTC
        // локальный getMonth() смещается на месяц назад — берём год/месяц из строки
        const m = /^(\d{4})-(\d{2})/.exec(iso);
        if (!m) return iso;
        const monthIndex = parseInt(m[2], 10) - 1;
        if (monthIndex < 0 || monthIndex > 11) return iso;
        if (lang === 'en') {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return months[monthIndex] + ' ' + m[1];
        }
        const months = ['янв.', 'фев.', 'мар.', 'апр.', 'май', 'июн.', 'июл.', 'авг.', 'сен.', 'окт.', 'ноя.', 'дек.'];
        return months[monthIndex] + ' ' + m[1];
    }

    function getYearSuffix(years, lang) {
        if (lang === 'en') return 'y';
        const lastDigit = years % 10;
        const lastTwoDigits = years % 100;
        if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return ' л.';
        if (lastDigit === 1) return ' г.';
        if (lastDigit >= 2 && lastDigit <= 4) return ' г.';
        return ' л.';
    }

    function formatDuration(startIso, endIso, lang) {
        if (!startIso) return '';
        const start = new Date(startIso);
        const end = endIso ? new Date(endIso) : new Date();
        if (isNaN(start.getTime()) || isNaN(end.getTime())) return '';

        let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
        if (end.getDate() < start.getDate()) months -= 1;
        const years = Math.floor(months / 12);
        const remMonths = months % 12;
        const parts = [];
        const monthSuffix = lang === 'en' ? 'mo' : ' м.';
        if (years > 0) parts.push(years + getYearSuffix(years, lang));
        if (remMonths > 0) parts.push(remMonths + monthSuffix);
        return parts.join(' ');
    }

    window.ResumeFormatters = {
        sanitizePhoneValue,
        formatTelegramValue,
        normalizeUrlWithHttps,
        isoToDisplay,
        displayToIso,
        formatMonthYear,
        formatDuration,
    };
})();
