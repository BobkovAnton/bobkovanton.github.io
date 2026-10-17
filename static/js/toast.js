function showToast(message, type, duration = 2500) {
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());
    const toastElement = document.createElement('div');
    toastElement.classList.add('toast', type);
    const iconElement = document.createElement('div');
    iconElement.classList.add('toast-icon');
    const messageElement = document.createElement('div');
    messageElement.classList.add('toast-message');
    messageElement.textContent = message;
    toastElement.appendChild(iconElement);
    toastElement.appendChild(messageElement);
    document.body.appendChild(toastElement);
    void toastElement.offsetWidth; 
    toastElement.classList.add('show');
    setTimeout(() => {
        toastElement.classList.remove('show');
        toastElement.classList.add('hide');
        setTimeout(() => {
            if (toastElement.parentNode) {
                toastElement.parentNode.removeChild(toastElement);
            }
        }, 250); 
    }, duration);
}

(function showPendingToast() {
    let raw = null;
    try {
        raw = localStorage.getItem('cv:pending_toast');
        if (raw) localStorage.removeItem('cv:pending_toast');
    } catch (e) {
        return;
    }
    if (!raw) return;
    try {
        const data = JSON.parse(raw);
        if (data && data.message) {
            showToast(data.message, data.type || 'success', data.duration || 2500);
        }
    } catch (e) {}
})();

window.showStatusChangedToast = function showStatusChangedToast(status, duration = 2500) {
    if (typeof showToast !== 'function') return;
    showToast('Статус изменён', 'success', duration);
};
