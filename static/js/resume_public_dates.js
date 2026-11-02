(function () {
    'use strict';


    function getLang() {
        return (window.ResumeConfig && window.ResumeConfig.publishedLang) || 'ru';
    }

    function pluralYears(n, lang) {
        if (lang === 'en') {
            return n === 1 ? 'year' : 'years';
        }
        var last2 = n % 100;
        var last = n % 10;
        if (last2 >= 11 && last2 <= 14) return 'лет';
        if (last === 1) return 'год';
        if (last >= 2 && last <= 4) return 'года';
        return 'лет';
    }

    function pluralMonths(n, lang) {
        if (lang === 'en') {
            return n === 1 ? 'month' : 'months';
        }
        var last2 = n % 100;
        var last = n % 10;
        if (last2 >= 11 && last2 <= 14) return 'месяцев';
        if (last === 1) return 'месяц';
        if (last >= 2 && last <= 4) return 'месяца';
        return 'месяцев';
    }

    function formatDurationLong(startIso, endIso, isCurrent, lang) {
        if (!window.ResumeFormatters || !window.ResumeFormatters.formatDuration) return '';
        var base = window.ResumeFormatters.formatDuration(startIso, isCurrent ? null : endIso);
        if (!base) return '';
        var parts = base.split(' ');
        var resultParts = [];
        for (var i = 0; i < parts.length; i++) {
            var num = parseInt(parts[i], 10);
            if (isNaN(num)) continue;
            var unit = parts[i + 1] || '';
            if (unit.indexOf('г') === 0 || unit.indexOf('л') === 0) {
                resultParts.push(num + ' ' + pluralYears(num, lang));
            } else if (unit.indexOf('м') === 0) {
                resultParts.push(num + ' ' + pluralMonths(num, lang));
            }
            i++;
        }
        return resultParts.join(' ');
    }


    var STRINGS = {
        ru: {
            present: 'н. в.',
            datesNotSpecified: 'даты не указаны',
            dateNotSpecified: 'дата не указана'
        },
        en: {
            present: 'present',
            datesNotSpecified: 'dates not specified',
            dateNotSpecified: 'date not specified'
        }
    };

    function calculateTotalExperience(lang) {
        var items = document.querySelectorAll('.resume-public-card .resume-public-list-dates');
        var periods = [];

        items.forEach(function(el) {
            var section = el.closest('.resume-public-card');
            if (!section) return;
            var title = section.querySelector('.resume-public-section-title');
            if (!title) return;
            var titleText = title.textContent.toLowerCase();
            if (titleText.indexOf('experience') === -1 && titleText.indexOf('опыт') === -1) return;

            var startIso = el.getAttribute('data-start-date');
            var endIso = el.getAttribute('data-end-date');
            var isCurrent = el.getAttribute('data-is-current') === '1';

            if (!startIso || startIso === 'None' || startIso === 'null') return;

            var start = new Date(startIso);
            var end = isCurrent ? new Date() : (endIso && endIso !== 'None' && endIso !== 'null' ? new Date(endIso) : new Date());

            if (isNaN(start.getTime()) || isNaN(end.getTime())) return;
            if (end < start) return;

            periods.push({ start: start.getTime(), end: end.getTime() });
        });

        if (periods.length === 0) return '';

        periods.sort(function(a, b) { return a.start - b.start; });

        var merged = [periods[0]];
        for (var i = 1; i < periods.length; i++) {
            var last = merged[merged.length - 1];
            var curr = periods[i];
            if (curr.start <= last.end) {
                last.end = Math.max(last.end, curr.end);
            } else {
                merged.push(curr);
            }
        }

        var totalMonths = 0;
        for (var j = 0; j < merged.length; j++) {
            var p = merged[j];
            var startDate = new Date(p.start);
            var endDate = new Date(p.end);

            var months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth()) + 1;
            if (endDate.getDate() < startDate.getDate()) months -= 1;
            totalMonths += Math.max(0, months);
        }

        var years = Math.floor(totalMonths / 12);
        var remMonths = totalMonths % 12;

        var parts = [];
        if (years > 0) parts.push(years + ' ' + pluralYears(years, lang));
        if (remMonths > 0) parts.push(remMonths + ' ' + pluralMonths(remMonths, lang));

        return parts.join(' ');
    }

    function applyDates() {
        if (!window.ResumeFormatters || !window.ResumeFormatters.formatMonthYear) return;

        var lang = getLang();
        var str = STRINGS[lang] || STRINGS.ru;

        function normalizeDate(value) {
            if (!value) return '';
            var v = String(value).trim();
            if (!v || v === 'None' || v === 'null' || v === 'undefined') return '';
            return v;
        }

        var totalExpEl = document.getElementById('total-work-experience');
        if (totalExpEl) {
            var totalExp = calculateTotalExperience(lang);
            if (totalExp) {
                totalExpEl.textContent = ' · ' + totalExp;
            }
        }

        var items = document.querySelectorAll('.resume-public-list-item');
        items.forEach(function (item) {
            var datesEl = item.querySelector('.resume-public-list-dates');
            if (!datesEl) return;
            var startIsoRaw = datesEl.getAttribute('data-start-date');
            var endIsoRaw = datesEl.getAttribute('data-end-date');
            var startIso = normalizeDate(startIsoRaw);
            var endIso = normalizeDate(endIsoRaw);
            var isCurrent = datesEl.getAttribute('data-is-current') === '1';
            var location = datesEl.getAttribute('data-location') || '';

            var startLabel = startIso ? window.ResumeFormatters.formatMonthYear(startIso, lang) : '';
            var endLabel = '';
            if (isCurrent) {
                endLabel = str.present;
            } else if (endIso) {
                endLabel = window.ResumeFormatters.formatMonthYear(endIso, lang);
            }

            var durationLabel = '';
            if (startIso && !datesEl.hasAttribute('data-no-duration')) {
                durationLabel = formatDurationLong(startIso, endIso, isCurrent, lang);
            }

            // Explicit project durations do not imply an unknown start date.
            var durationMonths = Number(datesEl.getAttribute('data-duration-months'));
            if (Number.isInteger(durationMonths) && durationMonths > 0) {
                durationLabel = durationMonths + ' ' + pluralMonths(durationMonths, lang);
            }
            var dateLabel = datesEl.getAttribute('data-date-label');
            var html = '';
            if (durationLabel) {
                html += '<div class="resume-public-duration">' + durationLabel + '</div>';
            }

            if (dateLabel) {
                html += '<div class="resume-public-date-line">' + window.CVEscape.escapeHtml(dateLabel) + '</div>';
            } else if (datesEl.hasAttribute('data-project-date') && startIso && endIso && startIso === endIso && !isCurrent) {
                html += '<div class="resume-public-date-line">' + endLabel + '</div>';
            } else if (!startIso && endIso && !isCurrent) {
                html += '<div class="resume-public-date-line">' + endLabel + '</div>';
            } else if (!startIso && !endIso && isCurrent) {
                html += '<div class="resume-public-date-line">' + str.present + '</div>';
            } else if (!startIso && !endIso && !isCurrent) {
                html += '<div class="resume-public-date-line">' + str.datesNotSpecified + '</div>';
            } else {
                var displayStart = startLabel || str.dateNotSpecified;
                var displayEnd;
                var isSingleDate = datesEl.hasAttribute('data-no-duration') && !isCurrent;

                if (isCurrent) {
                    displayEnd = str.present;
                } else if (endLabel) {
                    displayEnd = endLabel;
                } else {
                    displayEnd = str.dateNotSpecified;
                }

                if (isSingleDate && !endIso) {
                    html += '<div class="resume-public-date-line">' + displayStart + '</div>';
                } else {
                    html += '<div class="resume-public-date-line">' + displayStart + ' — ' + displayEnd + '</div>';
                }
            }

            if (location) {
                var safeLocation = (window.CVEscape && window.CVEscape.escapeHtml)
                    ? window.CVEscape.escapeHtml(location)
                    : String(location);
                html += '<div class="resume-public-location-inline">' + safeLocation + '</div>';
            }
            if (html) {
                datesEl.innerHTML = html;
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyDates);
    } else {
        applyDates();
    }
})();


