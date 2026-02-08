"use strict";
function getUTC9Time() {
    const date = new Date();
    const utc9 = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    const year = utc9.getUTCFullYear();
    const month = String(utc9.getUTCMonth() + 1).padStart(2, '0');
    const day = String(utc9.getUTCDate()).padStart(2, '0');
    let hour = utc9.getUTCHours();
    const minute = String(utc9.getUTCMinutes()).padStart(2, '0');
    const second = String(utc9.getUTCSeconds()).padStart(2, '0');
    const millisecond = String(utc9.getUTCMilliseconds()).padStart(3, '0');
    const determiner = hour < 12 ? 'AM' : 'PM';
    const displayHour = hour % 12 || 12;
    return `${year}-${month}-${day} ${String(displayHour).padStart(2, '0')}:${minute}:${second}.${millisecond} ${determiner}`;
}
const localTimeText = document.getElementById('local-time');
function updateTime() {
    localTimeText.textContent = getUTC9Time();
    requestAnimationFrame(updateTime);
}
updateTime();
let rippleContainer = document.getElementById('ripple-container');
document.addEventListener('mousedown', (e) => {
    const ripple = document.createElement('div');
    const size = 30;
    Object.assign(ripple.style, {
        position: 'absolute',
        left: `${e.clientX - size / 2}px`,
        top: `${e.clientY - size / 2}px`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        boxShadow: '0 0 7.5px rgba(255, 255, 255, 0.7), inset 0 0 5px rgba(255, 255, 255, 0.8)',
        borderRadius: '50%',
        transform: 'scale(0.5)',
        opacity: '0.6',
        transition: 'transform 0.75s ease-out, opacity 0.75s ease-out',
    });
    rippleContainer.appendChild(ripple);
    requestAnimationFrame(() => {
        ripple.style.transform = 'scale(5)';
        ripple.style.opacity = '0';
    });
    setTimeout(() => ripple.remove(), 600);
});
document.querySelectorAll('img').forEach((img) => {
    img.addEventListener('click', () => {
        window.open(img.src, '_blank');
    });
});
