(function () {
    'use strict';

    const BASE_CONTACTS = ['phone', 'telegram', 'email', 'site'];

    const SELECT_OPTIONS_BASE = {
        grade: ['Intern', 'Junior', 'Middle', 'Senior', 'Lead', 'Head'],
        location: [],
    };

    const SELECT_OPTIONS_RU = {
        work_format: ['Офис', 'Удалённо', 'Гибрид'],
        employment_type: ['Полная занятость', 'Частичная занятость', 'Проектная работа', 'Стажировка'],
        language: [
            'Английский',
            'Арабский',
            'Белорусский',
            'Вьетнамский',
            'Греческий',
            'Иврит',
            'Испанский',
            'Итальянский',
            'Казахский',
            'Каталанский',
            'Китайский',
            'Корейский',
            'Малайский',
            'Немецкий',
            'Нидерландский',
            'Польский',
            'Португальский',
            'Русский',
            'Сербский',
            'Тайский',
            'Турецкий',
            'Украинский',
            'Французский',
            'Хорватский',
            'Чешский',
            'Японский',
        ],
        language_level: [
            { value: 'A1', label: 'A1 — Начальный уровень' },
            { value: 'A2', label: 'A2 — Базовый уровень' },
            { value: 'B1', label: 'B1 — Средний уровень' },
            { value: 'B2', label: 'B2 — Продвинутый уровень' },
            { value: 'C1', label: 'C1 — Свободное владение' },
            { value: 'C2', label: 'C2 — Владение в совершенстве' },
            { value: 'Носитель', label: 'Носитель — Родной язык' },
        ],
        education_level: ['Среднее', 'Среднее специальное', 'Неоконченное высшее', 'Высшее бакалавриат', 'Высшее специалитет', 'Высшее магистратура', 'Высшее аспирантура', 'Высшее ординатура'],
    };

    const SELECT_OPTIONS_EN = {
        work_format: ['Office', 'Remote', 'Hybrid'],
        employment_type: ['Full-time', 'Part-time', 'Project-based', 'Internship'],
        language: [
            'Arabic',
            'Belarusian',
            'Catalan',
            'Chinese',
            'Croatian',
            'Czech',
            'Dutch',
            'English',
            'French',
            'German',
            'Greek',
            'Hebrew',
            'Italian',
            'Japanese',
            'Kazakh',
            'Korean',
            'Malay',
            'Polish',
            'Portuguese',
            'Russian',
            'Serbian',
            'Spanish',
            'Thai',
            'Turkish',
            'Ukrainian',
            'Vietnamese',
        ],
        language_level: [
            { value: 'A1', label: 'A1 — Beginner' },
            { value: 'A2', label: 'A2 — Elementary' },
            { value: 'B1', label: 'B1 — Intermediate' },
            { value: 'B2', label: 'B2 — Upper-Intermediate' },
            { value: 'C1', label: 'C1 — Advanced' },
            { value: 'C2', label: 'C2 — Proficient' },
            { value: 'Native', label: 'Native – Fluent' },
        ],
        education_level: ['Secondary', 'Secondary vocational', 'Incomplete higher', 'Bachelor\'s degree', 'Specialist degree', 'Master\'s degree', 'Postgraduate', 'Residency'],
    };

    const SELECT_OPTIONS = { ...SELECT_OPTIONS_BASE, ...SELECT_OPTIONS_RU };

    function getSelectOptions(lang) {
        const localized = lang === 'en' ? SELECT_OPTIONS_EN : SELECT_OPTIONS_RU;
        return { ...SELECT_OPTIONS_BASE, ...localized };
    }

    const LANGUAGE_LEVEL_TEXT = {
        'A1': 'Начальный уровень',
        'A2': 'Базовый уровень',
        'B1': 'Средний уровень',
        'B2': 'Продвинутый уровень',
        'C1': 'Свободное владение',
        'C2': 'Владение в совершенстве',
        'Носитель': 'Родной язык',
    };

    const LANGUAGE_LEVEL_TEXT_EN = {
        'A1': 'Beginner',
        'A2': 'Elementary',
        'B1': 'Intermediate',
        'B2': 'Upper-Intermediate',
        'C1': 'Advanced',
        'C2': 'Proficient',
        'Native': 'Fluent',
    };

    const WORK_FORMAT_TRANSLATE = {
        'Офис': 'Office',
        'Удалённо': 'Remote',
        'Гибрид': 'Hybrid',
    };

    const EMPLOYMENT_TYPE_TRANSLATE = {
        'Полная занятость': 'Full-time',
        'Частичная занятость': 'Part-time',
        'Проектная работа': 'Project-based',
        'Стажировка': 'Internship',
    };

    const WORK_FORMAT_TRANSLATE_REVERSE = Object.keys(WORK_FORMAT_TRANSLATE).reduce(function (acc, key) {
        acc[WORK_FORMAT_TRANSLATE[key]] = key;
        return acc;
    }, {});

    const EMPLOYMENT_TYPE_TRANSLATE_REVERSE = Object.keys(EMPLOYMENT_TYPE_TRANSLATE).reduce(function (acc, key) {
        acc[EMPLOYMENT_TYPE_TRANSLATE[key]] = key;
        return acc;
    }, {});

    function localizeEnSelectValues(values, mapping) {
        if (!Array.isArray(values) || !values.length) return values || [];
        var seen = {};
        return values.map(function (value) {
            return mapping[value] || value;
        }).filter(function (value) {
            if (!value || seen[value]) return false;
            seen[value] = true;
            return true;
        });
    }

    function getLanguageLevelText(lang) {
        return lang === 'en' ? LANGUAGE_LEVEL_TEXT_EN : LANGUAGE_LEVEL_TEXT;
    }

    function translateWorkFormat(value, lang) {
        if (lang !== 'en' || !value) return value;
        return WORK_FORMAT_TRANSLATE[value] || value;
    }

    function translateEmploymentType(value, lang) {
        if (lang !== 'en' || !value) return value;
        return EMPLOYMENT_TYPE_TRANSLATE[value] || value;
    }

    window.ResumeConfig = {
        BASE_CONTACTS,
        SELECT_OPTIONS,
        getSelectOptions,
        LANGUAGE_LEVEL_TEXT,
        LANGUAGE_LEVEL_TEXT_EN,
        getLanguageLevelText,
        translateWorkFormat,
        translateEmploymentType,
        WORK_FORMAT_TRANSLATE,
        WORK_FORMAT_TRANSLATE_REVERSE,
        localizeEnSelectValues,
        EMPLOYMENT_TYPE_TRANSLATE,
        EMPLOYMENT_TYPE_TRANSLATE_REVERSE,
    };
})();
