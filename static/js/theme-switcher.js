if (typeof process === 'undefined' ? (window.NODE_ENV !== 'development') : (process.env.NODE_ENV !== 'development')) {
    console.log = function(){};
    console.warn = function(){};
}
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    setTimeout(() => {
        if (typeof window.updateThemeColor === 'function') {
            window.updateThemeColor();
        } else if (typeof window.updateThemeColorMeta === 'function') {
            window.updateThemeColorMeta();
        }
    }, 0);
});
document.addEventListener('DOMContentLoaded', function() {
    const themeSwitchers = document.querySelectorAll('.theme-switcher, .theme-toggle');
    const burgerIcon = document.querySelector('.burger-menu svg[data-theme-color="light"] path');
    const closeIcons = document.querySelectorAll('.close-icon path, .mobile-updates-modal-close svg path');
    const sortSvg = document.querySelector('.sort-btn .theme-icon');
    const filterSvg = document.querySelector('.filter-btn .theme-icon');
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDarkTheme = savedTheme === 'dark' || (savedTheme === null && prefersDarkMode);
    if (isDarkTheme) {
        document.documentElement.classList.add('dark-theme');
        document.documentElement.classList.add('dark-init');
    } else {
        document.documentElement.classList.remove('dark-theme');
        document.documentElement.classList.remove('dark-init');
    }
    function applyDarkTheme(persist = true) {
        document.documentElement.classList.add('theme-preload');
        setTimeout(() => {
            document.documentElement.classList.add('dark-theme');
            document.documentElement.classList.add('dark-init');
            closeIcons.forEach(icon => {
                icon.setAttribute('fill', '#AFAEAA');
                icon.setAttribute('style', 'fill:#AFAEAA;fill:color(display-p3 0.6863 0.6824 0.6667);fill-opacity:1;');
            });
            if (sortSvg) {
                sortSvg.innerHTML = `<path d="M17.25 4L17.15 4.007C16.9701 4.03121 16.805 4.11985 16.6855 4.25648C16.566 4.39311 16.5 4.56846 16.5 4.75V17.442L13.28 14.224L13.196 14.152C13.0438 14.0389 12.8544 13.9876 12.6659 14.0085C12.4774 14.0294 12.3038 14.1209 12.1801 14.2647C12.0564 14.4084 11.9917 14.5937 11.9991 14.7832C12.0065 14.9727 12.0854 15.1523 12.22 15.286L16.724 19.786L16.808 19.858C16.9524 19.9647 17.1304 20.016 17.3095 20.0026C17.4886 19.9892 17.657 19.912 17.784 19.785L22.281 15.285L22.353 15.201C22.46 15.0565 22.5114 14.8783 22.498 14.6989C22.4846 14.5196 22.4073 14.351 22.28 14.224L22.196 14.152C22.0514 14.045 21.8732 13.9935 21.6939 14.0069C21.5146 14.0203 21.346 14.0977 21.219 14.225L18 17.446V4.75L17.994 4.648C17.9693 4.46845 17.8805 4.30389 17.7439 4.18477C17.6073 4.06564 17.4312 4.00001 17.25 4ZM6.21498 4.22L1.71998 8.715L1.64698 8.799C1.54026 8.94347 1.48894 9.12144 1.50233 9.30055C1.51573 9.47966 1.59296 9.64801 1.71998 9.775L1.80398 9.848C1.94845 9.95471 2.12642 10.006 2.30553 9.99264C2.48463 9.97925 2.65299 9.90202 2.77998 9.775L5.99698 6.557V19.255L6.00498 19.357C6.02962 19.5366 6.11846 19.7011 6.25505 19.8202C6.39163 19.9394 6.56674 20.005 6.74798 20.005L6.84898 19.998C7.02871 19.9736 7.19351 19.8848 7.31283 19.7482C7.43216 19.6116 7.49794 19.4364 7.49798 19.255L7.49698 6.559L10.72 9.776L10.804 9.848C10.9563 9.95972 11.1451 10.0098 11.3328 9.98838C11.5205 9.96691 11.6931 9.87543 11.8163 9.7322C11.9394 9.58897 12.004 9.40456 11.9971 9.2158C11.9901 9.02704 11.9123 8.84784 11.779 8.714L7.27498 4.22L7.18998 4.148C7.04551 4.04129 6.86754 3.98996 6.68843 4.00336C6.50932 4.01675 6.34097 4.09398 6.21398 4.221" fill="white" style="fill:white;fill-opacity:1;"/>`;
            }
            if (filterSvg) {
                filterSvg.innerHTML = `<path d="M13.5 16C13.6989 16 13.8897 16.079 14.0303 16.2197C14.171 16.3603 14.25 16.5511 14.25 16.75C14.25 16.9489 14.171 17.1397 14.0303 17.2803C13.8897 17.421 13.6989 17.5 13.5 17.5H10.5C10.3011 17.5 10.1103 17.421 9.96967 17.2803C9.82902 17.1397 9.75 16.9489 9.75 16.75C9.75 16.5511 9.82902 16.3603 9.96967 16.2197C10.1103 16.079 10.3011 16 10.5 16H13.5ZM16.5 11C16.6989 11 16.8897 11.079 17.0303 11.2197C17.171 11.3603 17.25 11.5511 17.25 11.75C17.25 11.9489 17.171 12.1397 17.0303 12.2803C16.8897 12.421 16.6989 12.5 16.5 12.5H7.5C7.30109 12.5 7.11032 12.421 6.96967 12.2803C6.82902 12.1397 6.75 11.9489 6.75 11.75C6.75 11.5511 6.82902 11.3603 6.96967 11.2197C7.11032 11.079 7.30109 11 7.5 11H16.5ZM19.5 6C19.6989 6 19.8897 6.07902 20.0303 6.21967C20.171 6.36032 20.25 6.55109 20.25 6.75C20.25 6.94891 20.171 7.13968 20.0303 7.28033C19.8897 7.42098 19.6989 7.5 19.5 7.5H4.5C4.30109 7.5 4.11032 7.42098 3.96967 7.28033C3.82902 7.13968 3.75 6.94891 3.75 6.75C3.75 6.55109 3.82902 6.36032 3.96967 6.21967C4.11032 6.07902 4.30109 6 4.5 6H19.5Z" fill="white" style="fill:white;fill-opacity:1;"/>`;
            }
            if (persist) localStorage.setItem('theme', 'dark');
            setTimeout(() => {
                document.documentElement.classList.remove('theme-preload');
            }, 100);
        }, 10);
    }
    function applyLightTheme(persist = true) {
        document.documentElement.classList.add('theme-preload');
        setTimeout(() => {
            document.documentElement.classList.remove('dark-theme');
            document.documentElement.classList.remove('dark-init');
            closeIcons.forEach(icon => {
                icon.setAttribute('fill', '#AFAEAA');
                icon.setAttribute('style', 'fill:#AFAEAA;fill:color(display-p3 0.6863 0.6824 0.6667);fill-opacity:1;');
            });
            if (sortSvg) {
                sortSvg.innerHTML = `<path d="M17.25 4L17.15 4.007C16.9701 4.03121 16.805 4.11985 16.6855 4.25648C16.566 4.39311 16.5 4.56846 16.5 4.75V17.442L13.28 14.224L13.196 14.152C13.0438 14.0389 12.8544 13.9876 12.6659 14.0085C12.4774 14.0294 12.3038 14.1209 12.1801 14.2647C12.0564 14.4084 11.9917 14.5937 11.9991 14.7832C12.0065 14.9727 12.0854 15.1523 12.22 15.286L16.724 19.786L16.808 19.858C16.9524 19.9647 17.1304 20.016 17.3095 20.0026C17.4886 19.9892 17.657 19.912 17.784 19.785L22.281 15.285L22.353 15.201C22.46 15.0565 22.5114 14.8783 22.498 14.6989C22.4846 14.5196 22.4073 14.351 22.28 14.224L22.196 14.152C22.0514 14.045 21.8732 13.9935 21.6939 14.0069C21.5146 14.0203 21.346 14.0977 21.219 14.225L18 17.446V4.75L17.994 4.648C17.9693 4.46845 17.8805 4.30389 17.7439 4.18477C17.6073 4.06564 17.4312 4.00001 17.25 4ZM6.21498 4.22L1.71998 8.715L1.64698 8.799C1.54026 8.94347 1.48894 9.12144 1.50233 9.30055C1.51573 9.47966 1.59296 9.64801 1.71998 9.775L1.80398 9.848C1.94845 9.95471 2.12642 10.006 2.30553 9.99264C2.48463 9.97925 2.65299 9.90202 2.77998 9.775L5.99698 6.557V19.255L6.00498 19.357C6.02962 19.5366 6.11846 19.7011 6.25505 19.8202C6.39163 19.9394 6.56674 20.005 6.74798 20.005L6.84898 19.998C7.02871 19.9736 7.19351 19.8848 7.31283 19.7482C7.43216 19.6116 7.49794 19.4364 7.49798 19.255L7.49698 6.559L10.72 9.776L10.804 9.848C10.9563 9.95972 11.1451 10.0098 11.3328 9.98838C11.5205 9.96691 11.6931 9.87543 11.8163 9.7322C11.9394 9.58897 12.004 9.40456 11.9971 9.2158C11.9901 9.02704 11.9123 8.84784 11.779 8.714L7.27498 4.22L7.18998 4.148C7.04551 4.04129 6.86754 3.98996 6.68843 4.00336C6.50932 4.01675 6.34097 4.09398 6.21398 4.221" fill="#2F384C" style="fill:#2F384C;fill-opacity:1;"/>`;
            }
            if (filterSvg) {
                filterSvg.innerHTML = `<path d="M13.5 16C13.6989 16 13.8897 16.079 14.0303 16.2197C14.171 16.3603 14.25 16.5511 14.25 16.75C14.25 16.9489 14.171 17.1397 14.0303 17.2803C13.8897 17.421 13.6989 17.5 13.5 17.5H10.5C10.3011 17.5 10.1103 17.421 9.96967 17.2803C9.82902 17.1397 9.75 16.9489 9.75 16.75C9.75 16.5511 9.82902 16.3603 9.96967 16.2197C10.1103 16.079 10.3011 16 10.5 16H13.5ZM16.5 11C16.6989 11 16.8897 11.079 17.0303 11.2197C17.171 11.3603 17.25 11.5511 17.25 11.75C17.25 11.9489 17.171 12.1397 17.0303 12.2803C16.8897 12.421 16.6989 12.5 16.5 12.5H7.5C7.30109 12.5 7.11032 12.421 6.96967 12.2803C6.82902 12.1397 6.75 11.9489 6.75 11.75C6.75 11.5511 6.82902 11.3603 6.96967 11.2197C7.11032 11.079 7.30109 11 7.5 11H16.5ZM19.5 6C19.6989 6 19.8897 6.07902 20.0303 6.21967C20.171 6.36032 20.25 6.55109 20.25 6.75C20.25 6.94891 20.171 7.13968 20.0303 7.28033C19.8897 7.42098 19.6989 7.5 19.5 7.5H4.5C4.30109 7.5 4.11032 7.42098 3.96967 7.28033C3.82902 7.13968 3.75 6.94891 3.75 6.75C3.75 6.55109 3.82902 6.36032 3.96967 6.21967C4.11032 6.07902 4.30109 6 4.5 6H19.5Z" fill="#2F384C" style="fill:#2F384C;fill-opacity:1;"/>`;
            }
            if (persist) localStorage.setItem('theme', 'light');
            setTimeout(() => {
                document.documentElement.classList.remove('theme-preload');
            }, 100);
        }, 10);
    }
    function resetToSystemTheme() {
        localStorage.removeItem('theme');
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDarkMode) {
            applyDarkTheme(false);
        } else {
            applyLightTheme(false);
        }
    }
    if (isDarkTheme) {
        closeIcons.forEach(icon => {
            icon.setAttribute('fill', '#AFAEAA');
            icon.setAttribute('style', 'fill:#AFAEAA;fill:color(display-p3 0.6863 0.6824 0.6667);fill-opacity:1;');
        });
        if (sortSvg) {
            sortSvg.innerHTML = `<path d="M17.25 4L17.15 4.007C16.9701 4.03121 16.805 4.11985 16.6855 4.25648C16.566 4.39311 16.5 4.56846 16.5 4.75V17.442L13.28 14.224L13.196 14.152C13.0438 14.0389 12.8544 13.9876 12.6659 14.0085C12.4774 14.0294 12.3038 14.1209 12.1801 14.2647C12.0564 14.4084 11.9917 14.5937 11.9991 14.7832C12.0065 14.9727 12.0854 15.1523 12.22 15.286L16.724 19.786L16.808 19.858C16.9524 19.9647 17.1304 20.016 17.3095 20.0026C17.4886 19.9892 17.657 19.912 17.784 19.785L22.281 15.285L22.353 15.201C22.46 15.0565 22.5114 14.8783 22.498 14.6989C22.4846 14.5196 22.4073 14.351 22.28 14.224L22.196 14.152C22.0514 14.045 21.8732 13.9935 21.6939 14.0069C21.5146 14.0203 21.346 14.0977 21.219 14.225L18 17.446V4.75L17.994 4.648C17.9693 4.46845 17.8805 4.30389 17.7439 4.18477C17.6073 4.06564 17.4312 4.00001 17.25 4ZM6.21498 4.22L1.71998 8.715L1.64698 8.799C1.54026 8.94347 1.48894 9.12144 1.50233 9.30055C1.51573 9.47966 1.59296 9.64801 1.71998 9.775L1.80398 9.848C1.94845 9.95471 2.12642 10.006 2.30553 9.99264C2.48463 9.97925 2.65299 9.90202 2.77998 9.775L5.99698 6.557V19.255L6.00498 19.357C6.02962 19.5366 6.11846 19.7011 6.25505 19.8202C6.39163 19.9394 6.56674 20.005 6.74798 20.005L6.84898 19.998C7.02871 19.9736 7.19351 19.8848 7.31283 19.7482C7.43216 19.6116 7.49794 19.4364 7.49798 19.255L7.49698 6.559L10.72 9.776L10.804 9.848C10.9563 9.95972 11.1451 10.0098 11.3328 9.98838C11.5205 9.96691 11.6931 9.87543 11.8163 9.7322C11.9394 9.58897 12.004 9.40456 11.9971 9.2158C11.9901 9.02704 11.9123 8.84784 11.779 8.714L7.27498 4.22L7.18998 4.148C7.04551 4.04129 6.86754 3.98996 6.68843 4.00336C6.50932 4.01675 6.34097 4.09398 6.21398 4.221" fill="white" style="fill:white;fill-opacity:1;"/>`;
        }
        if (filterSvg) {
            filterSvg.innerHTML = `<path d="M13.5 16C13.6989 16 13.8897 16.079 14.0303 16.2197C14.171 16.3603 14.25 16.5511 14.25 16.75C14.25 16.9489 14.171 17.1397 14.0303 17.2803C13.8897 17.421 13.6989 17.5 13.5 17.5H10.5C10.3011 17.5 10.1103 17.421 9.96967 17.2803C9.82902 17.1397 9.75 16.9489 9.75 16.75C9.75 16.5511 9.82902 16.3603 9.96967 16.2197C10.1103 16.079 10.3011 16 10.5 16H13.5ZM16.5 11C16.6989 11 16.8897 11.079 17.0303 11.2197C17.171 11.3603 17.25 11.5511 17.25 11.75C17.25 11.9489 17.171 12.1397 17.0303 12.2803C16.8897 12.421 16.6989 12.5 16.5 12.5H7.5C7.30109 12.5 7.11032 12.421 6.96967 12.2803C6.82902 12.1397 6.75 11.9489 6.75 11.75C6.75 11.5511 6.82902 11.3603 6.96967 11.2197C7.11032 11.079 7.30109 11 7.5 11H16.5ZM19.5 6C19.6989 6 19.8897 6.07902 20.0303 6.21967C20.171 6.36032 20.25 6.55109 20.25 6.75C20.25 6.94891 20.171 7.13968 20.0303 7.28033C19.8897 7.42098 19.6989 7.5 19.5 7.5H4.5C4.30109 7.5 4.11032 7.42098 3.96967 7.28033C3.82902 7.13968 3.75 6.94891 3.75 6.75C3.75 6.55109 3.82902 6.36032 3.96967 6.21967C4.11032 6.07902 4.30109 6 4.5 6H19.5Z" fill="white" style="fill:white;fill-opacity:1;"/>`;
        }
    } else {
        closeIcons.forEach(icon => {
            icon.setAttribute('fill', '#AFAEAA');
            icon.setAttribute('style', 'fill:#AFAEAA;fill:color(display-p3 0.6863 0.6824 0.6667);fill-opacity:1;');
        });
        if (sortSvg) {
            sortSvg.innerHTML = `<path d="M17.25 4L17.15 4.007C16.9701 4.03121 16.805 4.11985 16.6855 4.25648C16.566 4.39311 16.5 4.56846 16.5 4.75V17.442L13.28 14.224L13.196 14.152C13.0438 14.0389 12.8544 13.9876 12.6659 14.0085C12.4774 14.0294 12.3038 14.1209 12.1801 14.2647C12.0564 14.4084 11.9917 14.5937 11.9991 14.7832C12.0065 14.9727 12.0854 15.1523 12.22 15.286L16.724 19.786L16.808 19.858C16.9524 19.9647 17.1304 20.016 17.3095 20.0026C17.4886 19.9892 17.657 19.912 17.784 19.785L22.281 15.285L22.353 15.201C22.46 15.0565 22.5114 14.8783 22.498 14.6989C22.4846 14.5196 22.4073 14.351 22.28 14.224L22.196 14.152C22.0514 14.045 21.8732 13.9935 21.6939 14.0069C21.5146 14.0203 21.346 14.0977 21.219 14.225L18 17.446V4.75L17.994 4.648C17.9693 4.46845 17.8805 4.30389 17.7439 4.18477C17.6073 4.06564 17.4312 4.00001 17.25 4ZM6.21498 4.22L1.71998 8.715L1.64698 8.799C1.54026 8.94347 1.48894 9.12144 1.50233 9.30055C1.51573 9.47966 1.59296 9.64801 1.71998 9.775L1.80398 9.848C1.94845 9.95471 2.12642 10.006 2.30553 9.99264C2.48463 9.97925 2.65299 9.90202 2.77998 9.775L5.99698 6.557V19.255L6.00498 19.357C6.02962 19.5366 6.11846 19.7011 6.25505 19.8202C6.39163 19.9394 6.56674 20.005 6.74798 20.005L6.84898 19.998C7.02871 19.9736 7.19351 19.8848 7.31283 19.7482C7.43216 19.6116 7.49794 19.4364 7.49798 19.255L7.49698 6.559L10.72 9.776L10.804 9.848C10.9563 9.95972 11.1451 10.0098 11.3328 9.98838C11.5205 9.96691 11.6931 9.87543 11.8163 9.7322C11.9394 9.58897 12.004 9.40456 11.9971 9.2158C11.9901 9.02704 11.9123 8.84784 11.779 8.714L7.27498 4.22L7.18998 4.148C7.04551 4.04129 6.86754 3.98996 6.68843 4.00336C6.50932 4.01675 6.34097 4.09398 6.21398 4.221" fill="#2F384C" style="fill:#2F384C;fill:color(display-p3 0.1824 0.2208 0.2976);fill-opacity:1;"/>`;
        }
        if (filterSvg) {
            filterSvg.innerHTML = `<path d="M13.5 16C13.6989 16 13.8897 16.079 14.0303 16.2197C14.171 16.3603 14.25 16.5511 14.25 16.75C14.25 16.9489 14.171 17.1397 14.0303 17.2803C13.8897 17.421 13.6989 17.5 13.5 17.5H10.5C10.3011 17.5 10.1103 17.421 9.96967 17.2803C9.82902 17.1397 9.75 16.9489 9.75 16.75C9.75 16.5511 9.82902 16.3603 9.96967 16.2197C10.1103 16.079 10.3011 16 10.5 16H13.5ZM16.5 11C16.6989 11 16.8897 11.079 17.0303 11.2197C17.171 11.3603 17.25 11.5511 17.25 11.75C17.25 11.9489 17.171 12.1397 17.0303 12.2803C16.8897 12.421 16.6989 12.5 16.5 12.5H7.5C7.30109 12.5 7.11032 12.421 6.96967 12.2803C6.82902 12.1397 6.75 11.9489 6.75 11.75C6.75 11.5511 6.82902 11.3603 6.96967 11.2197C7.11032 11.079 7.30109 11 7.5 11H16.5ZM19.5 6C19.6989 6 19.8897 6.07902 20.0303 6.21967C20.171 6.36032 20.25 6.55109 20.25 6.75C20.25 6.94891 20.171 7.13968 20.0303 7.28033C19.8897 7.42098 19.6989 7.5 19.5 7.5H4.5C4.30109 7.5 4.11032 7.42098 3.96967 7.28033C3.82902 7.13968 3.75 6.94891 3.75 6.75C3.75 6.55109 3.82902 6.36032 3.96967 6.21967C4.11032 6.07902 4.30109 6 4.5 6H19.5Z" fill="#2F384C" style="fill:#2F384C;fill-opacity:1;"/>`;
        }
    }
    themeSwitchers.forEach(switcher => {
        switcher.addEventListener('click', function() {
            const isDark = document.documentElement.classList.contains('dark-theme');
            if (isDark) {
                applyLightTheme();
            } else {
                applyDarkTheme();
            }


            requestAnimationFrame(() => {
                try { switcher.blur(); } catch(e) {}
                if (document.activeElement === switcher && document.activeElement.blur) {
                    document.activeElement.blur();
                }
            });
        });

        ['pointerup','touchend','mouseup'].forEach(evt => {
            switcher.addEventListener(evt, () => {
                setTimeout(() => { try { switcher.blur(); } catch(e) {} }, 0);
            }, { passive: true });
        });
    });
    const mobileThemeSwitchers = document.querySelectorAll('.mobile-theme-switcher, .theme-toggle.mobile-theme-switcher');
    mobileThemeSwitchers.forEach(switcher => {
        switcher.addEventListener('click', function() {
            const isDark = document.documentElement.classList.contains('dark-theme');
            if (isDark) {
                applyLightTheme();
            } else {
                applyDarkTheme();
            }


            requestAnimationFrame(() => {
                try { switcher.blur(); } catch(e) {}
                if (document.activeElement === switcher && document.activeElement.blur) {
                    document.activeElement.blur();
                }
            });
        });
        ['pointerup','touchend','mouseup'].forEach(evt => {
            switcher.addEventListener(evt, () => {
                setTimeout(() => { try { switcher.blur(); } catch(e) {} }, 0);
            }, { passive: true });
        });
    });
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        if (!localStorage.getItem('theme')) {
            if (event.matches) {
                applyDarkTheme(false);
            } else {
                applyLightTheme(false);
            }
        }
    });

    function initProfileThemeSelector() {
        const inputs = document.querySelectorAll('input[name="themePreference"], .theme-preference-input');
        if (!inputs.length) return;

        const saved = localStorage.getItem('theme');
        const current = (saved === 'dark' || saved === 'light') ? saved : 'system';
        inputs.forEach((input) => {
            input.checked = input.value === current;
        });

        inputs.forEach((input) => {
            input.addEventListener('change', () => {
                if (!input.checked) return;
                if (input.value === 'system') return resetToSystemTheme();
                if (input.value === 'dark') return applyDarkTheme(true);
                if (input.value === 'light') return applyLightTheme(true);
            });
        });
    }

    initProfileThemeSelector();
    const MOBILE_MENU_GAP = 8;
    const DEFAULT_MOBILE_MENU_TOP = 68;
    function calculateMobileMenuPosition() {
        const header = document.querySelector('.header.mobile-header');
        if (!header) return DEFAULT_MOBILE_MENU_TOP;
        const headerRect = header.getBoundingClientRect();
        const glassOutset = header.classList.contains('is-pinned')
            ? parseFloat(getComputedStyle(header).getPropertyValue('--header-glass-outset')) || 0
            : 0;
        return Math.round(headerRect.bottom + glassOutset + MOBILE_MENU_GAP);
    }

    function updateMobileMenuPosition() {
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu) {
            const topPosition = calculateMobileMenuPosition();
            mobileMenu.style.top = topPosition + 'px';
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
            const availableHeight = Math.max(260, viewportHeight - topPosition - 12);
            mobileMenu.style.maxHeight = availableHeight + 'px';
            mobileMenu.style.overflowY = 'auto';
        }
    }

    function initMobileMenu() {
        const burgerMenu = document.querySelector('.burger-menu');
        const mobileMenu = document.querySelector('.mobile-menu');
        if (!burgerMenu || !mobileMenu) return;

        burgerMenu.addEventListener('click', function() {
            burgerMenu.classList.toggle('active');
            if (!mobileMenu.classList.contains('visible')) {
                updateMobileMenuPosition();
                mobileMenu.style.display = 'block';
                setTimeout(() => {
                    mobileMenu.classList.add('visible');
                }, 10);
                setTimeout(() => {
                    document.addEventListener('click', closeOnClickOutside);
                }, 10);
            } else {
                void mobileMenu.offsetWidth;
                mobileMenu.classList.remove('visible');
                setTimeout(() => {
                    if (!mobileMenu.classList.contains('visible')) {
                        mobileMenu.style.display = 'none';
                    }
                }, 300);
                document.removeEventListener('click', closeOnClickOutside);
            }
        });
        function closeOnClickOutside(event) {
            if (!mobileMenu.contains(event.target) && !burgerMenu.contains(event.target)) {
                burgerMenu.classList.remove('active');
                void mobileMenu.offsetWidth;
                mobileMenu.classList.remove('visible');
                setTimeout(() => {
                    if (!mobileMenu.classList.contains('visible')) {
                        mobileMenu.style.display = 'none';
                    }
                }, 300);
                document.removeEventListener('click', closeOnClickOutside);
            }
        }
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                if (mobileMenu.classList.contains('visible')) {
                    burgerMenu.classList.remove('active');
                    void mobileMenu.offsetWidth;
                    mobileMenu.classList.remove('visible');
                    setTimeout(() => {
                        if (!mobileMenu.classList.contains('visible')) {
                            mobileMenu.style.display = 'none';
                        }
                    }, 300);
                }
            }
        });
    }
    initMobileMenu();


    window.addEventListener('resize', updateMobileMenuPosition);

    (() => {
        const burgerMenu = document.querySelector('.burger-menu');
        const mobileMenu = document.querySelector('.mobile-menu');
        if (!burgerMenu || !mobileMenu) return;
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40 && mobileMenu.classList.contains('visible')) {
                burgerMenu.click();
            }
        });
    })();
});
