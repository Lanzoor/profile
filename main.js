function getUTC9Time(use_determiner = false) {
    const date = new Date();
    const utc9 = new Date(date.getTime() + 9 * 60 * 60 * 1000);

    let hour = utc9.getUTCHours();
    const minute = String(utc9.getUTCMinutes()).padStart(2, '0');
    const second = String(utc9.getUTCSeconds()).padStart(2, '0');
    const millisecond = String(utc9.getUTCMilliseconds()).padEnd(3, '0');

    if (use_determiner) {
        const determiner = hour < 12 ? 'AM' : 'PM';
        const displayHour = hour % 12 || 12;
        return `${String(displayHour).padStart(2, '0')}:${minute}:${second}.${millisecond} ${determiner}`;
    } else {
        return `${String(hour).padStart(2, '0')}:${minute}:${second}.${millisecond}`;
    }
}

const time_text = document.getElementById('time_text');

let time_hovered = false;

function updateTime() {
    const normal = getUTC9Time(false);
    const withDeterminer = getUTC9Time(true);

    if (time_hovered) {
        time_text.textContent = withDeterminer;
    } else {
        time_text.textContent = normal;
    }

    requestAnimationFrame(updateTime);
}

time_text.addEventListener('mouseenter', () => (time_hovered = true));
time_text.addEventListener('mouseleave', () => (time_hovered = false));

updateTime();

const block = document.getElementById('private');
const hidden = block.querySelector('.hidden');
const revealed = block.querySelector('.revealed');

let hoverTimer = null;
let activated = false;

block.addEventListener('mouseenter', () => {
    hidden.textContent = '( - Keep hovering... - )';
    hoverTimer = setTimeout(() => {
        hidden.hidden = true;
        revealed.hidden = false;
        activated = true;
    }, 2000);
});

block.addEventListener('mouseleave', () => {
    clearTimeout(hoverTimer);
    hoverTimer = null;

    if (!activated) {
        hidden.textContent = '( - Hover to reveal - )';
        hidden.hidden = false;
        revealed.hidden = true;
    }
});
