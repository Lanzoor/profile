function getUTC9Time() {
    const date = new Date();

    const utc9 = new Date(date.getTime() + 9 * 60 * 60 * 1000);

    const hh = String(utc9.getUTCHours()).padStart(2, '0');
    const mm = String(utc9.getUTCMinutes()).padStart(2, '0');
    const ss = String(utc9.getUTCSeconds()).padStart(2, '0');

    return `${hh}:${mm}:${ss}`;
}

const time_text = document.getElementById('time_text');

setInterval(() => {
    time_text.innerText = getUTC9Time();
}, 500);
