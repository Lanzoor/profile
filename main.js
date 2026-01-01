function getUTC9Time() {
    const date = new Date();
    const utc9 = new Date(date.getTime() + 9 * 60 * 60 * 1000);

    let hour = utc9.getUTCHours();
    const minute = String(utc9.getUTCMinutes()).padStart(2, '0');
    const second = String(utc9.getUTCSeconds()).padStart(2, '0');
    const millisecond = String(utc9.getUTCMilliseconds()).padEnd(3, '0');

    const determiner = hour < 12 ? 'AM' : 'PM';
    const displayHour = hour % 12 || 12;
    return `${String(displayHour).padStart(2, '0')}:${minute}:${second}.${millisecond} ${determiner}`;
}

const timeText = document.getElementById('time_text');

function updateTime() {
    timeText.textContent = getUTC9Time();

    requestAnimationFrame(updateTime);
}

timeText.addEventListener('mouseenter', () => (time_hovered = true));
timeText.addEventListener('mouseleave', () => (time_hovered = false));

updateTime();

const backToTop = document.getElementById('back-to-top');

backToTop.addEventListener('mouseenter', () => {
    backToTop.style.boxShadow = 'inset 0 0 40px #6030ffff, 0 50px 50px #3e0edd';
    backToTop.style.cursor = 'pointer';
});

backToTop.addEventListener('mouseleave', () => {
    backToTop.style.boxShadow = 'inset 0 0 20px #3e0edd, 0 50px 50px #3e0edd';
    backToTop.style.transform = 'translateY(0)';
    backToTop.style.cursor = 'default';
});

backToTop.addEventListener('mousedown', () => {
    backToTop.style.transform = 'translateY(25px)';
    backToTop.style.boxShadow = 'inset 0 0 40px #3e0edd, 0 25px 50px #3e0edd';
});

backToTop.addEventListener('mouseup', () => {
    backToTop.style.transform = 'translateY(0)';
    backToTop.style.boxShadow = 'inset 0 0 20px #3e0edd, 0 50px 50px #3e0edd';
    setTimeout(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, 250);
});
