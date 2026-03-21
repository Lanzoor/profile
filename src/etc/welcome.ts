import { pingServer } from '../ping-server.js';

let enableAnimation = true;

async function sleep(timeMs: number): Promise<any> {
    return new Promise((p) => setTimeout(p, timeMs));
}

function pickRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

document.addEventListener('DOMContentLoaded', async () => {
    const elements = ['#welcome--header', '#welcome--message', '#welcome--buttons', '#welcome--down'];

    const htmlElements = elements
        .map((element) => {
            return document.querySelector(element);
        })
        .filter(Boolean) as HTMLElement[];

    htmlElements.forEach((element) => {
        element?.classList.remove('active');
        element?.classList.add('inactive');
    });

    await sleep(500);

    for (const element of htmlElements) {
        element.classList.remove('inactive');
        element.classList.add('active');

        await sleep(1000);
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    const updateDisplay = document.getElementById('update-display')!;
    const avatarDisplay = document.getElementById('discord-status--avatar')! as HTMLImageElement;
    const displayNameDisplay = document.getElementById('discord-status--display-name')!;
    const usernameDisplay = document.getElementById('discord-status--username')!;
    const userIDDisplay = document.getElementById('discord-status--user-id')!;
    const statusDisplay = document.getElementById('discord-status--status')!;

    let defaultLastUpdated = updateDisplay.textContent;

    try {
        const statusResult = await pingServer('https://lanzoor.dev/api/status/');
        if (statusResult) {
            updateDisplay.textContent = new Date(statusResult.createdAt).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric' });
        } else {
            updateDisplay.textContent = defaultLastUpdated;
        }
    } catch (err) {
        console.error(err);
        updateDisplay.textContent = defaultLastUpdated;
    }

    const discordStatusResult = await pingServer('https://www.lanzoor.dev/api/discord-status');
    if (discordStatusResult) {
        const discordUserID = discordStatusResult.data.discord_user.id;

        const discordAvatar = discordStatusResult.data.discord_user.avatar;
        const discordAvatarURL = `https://cdn.discordapp.com/avatars/${discordUserID}/${discordAvatar}.png?size=512`;

        const discordDisplayName = discordStatusResult.data.discord_user.global_name;
        const discordUserName = discordStatusResult.data.discord_user.username;

        const discordStatus = discordStatusResult.data.discord_status;

        avatarDisplay.src = discordAvatarURL;
        displayNameDisplay.textContent = discordDisplayName;
        usernameDisplay.textContent = discordUserName;
        userIDDisplay.textContent = discordUserID;
        statusDisplay.className = '';
        statusDisplay.textContent = discordStatus;
        statusDisplay.classList.add(`status-${discordStatus}`);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('profile--name-display')!;
    const animationToggle = container.querySelector('#profile--name-display button')!;

    animationToggle.addEventListener('click', () => {
        enableAnimation = !enableAnimation;
        animationToggle.textContent = enableAnimation ? '⏸ Pause animation' : '▶ Resume animation';
    });

    const stars: HTMLElement[] = [];

    function randomizeStar(star: HTMLElement, initial = false) {
        const size = Math.random() * 6;
        const opacity = randInt(3, 10) / 10;

        star.style.width = star.style.height = size + 'px';
        star.style.left = Math.random() * 100 + '%';
        star.dataset.top = initial ? String(Math.random() * 100) : String(100 + Math.random() * 20);

        star.style.top = star.dataset.top + '%';
        star.style.opacity = String(opacity);
        star.dataset.speed = String(opacity * 0.3);
    }

    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.classList.add('star');

        randomizeStar(star, true);

        container.appendChild(star);
        stars.push(star);
    }

    function update() {
        if (enableAnimation) {
            for (const star of stars) {
                let top = parseFloat(star.dataset.top!);
                const speed = parseFloat(star.dataset.speed!);

                top -= speed;

                if (top < -10) {
                    star.style.transition = 'none';
                    randomizeStar(star);

                    star.getBoundingClientRect();

                    star.style.transition = '';
                    continue;
                }

                star.dataset.top = String(top);
                star.style.top = top + '%';
            }
        }

        requestAnimationFrame(update);
    }

    update();
});

document.addEventListener('DOMContentLoaded', () => {
    const lanzoorLetters = Array.from(document.querySelectorAll('#profile--name-display span')).map((span) => span as HTMLSpanElement);
    const fonts = ['Geist', 'Space Grotesk', 'JetBrains Mono', 'Fira Code', 'Fairfax HD', 'Brass Mono'];
    let index = 0;

    setInterval(() => {
        if (!enableAnimation) {
            return;
        }

        let currentFont = fonts[index];
        let currentFontWeight = pickRandom(['100', '200', '300', '400']);
        let currentFontStyle = pickRandom(['normal', 'italic']);
        let currentFontSize = randInt(100, 150);

        for (const letter of lanzoorLetters) {
            letter.style.fontFamily = currentFont;
            letter.style.fontWeight = currentFontWeight;
            letter.style.fontStyle = currentFontStyle;
            letter.style.fontSize = String(currentFontSize) + 'px';
        }

        index = (index + 1) % fonts.length;
    }, 750);
});
