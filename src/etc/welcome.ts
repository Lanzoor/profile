import { pingServer } from '../ping-server.js';

function isMobileDevice() {
    return (navigator as any).userAgentData?.mobile || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || ('ontouchstart' in window && navigator.maxTouchPoints > 0);
}

async function sleep(timeMs: number): Promise<any> {
    return new Promise((p) => setTimeout(p, timeMs));
}

function pickRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let enableAnimation = true;
let enableOptimization = false;

let starLimit = 100;
let animationIntervalMs = 1000;
let baseFontSizePx = 80;

function updateOptimization() {
    enableOptimization = window.matchMedia('(max-width: 1080px)').matches || isMobileDevice();

    const indicator = document.querySelector('#profile--name-display #optimization-indicator')!;

    starLimit = enableOptimization ? 50 : 100;
    animationIntervalMs = enableOptimization ? 2000 : 1000;
    baseFontSizePx = enableOptimization ? 40 : 80;

    indicator.classList.toggle('active', enableOptimization);

    startFontAnimation();
}

document.addEventListener('DOMContentLoaded', updateOptimization);
window.addEventListener('resize', updateOptimization);

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

    function randomizeStars(star: HTMLElement, initial = false) {
        const size = Math.random() * 6;
        const opacity = randInt(3, 10) / 10;

        star.style.width = star.style.height = size + 'px';
        star.style.left = Math.random() * 100 + '%';
        star.dataset.top = initial ? String(Math.random() * 100) : String(100 + Math.random() * 20);

        star.style.top = star.dataset.top + '%';
        star.style.opacity = String(opacity);
        star.dataset.speed = String(opacity * 0.3);
    }

    for (let index = 0; index < starLimit; index++) {
        const star = document.createElement('div');
        star.classList.add('star');

        randomizeStars(star, true);

        container.appendChild(star);
        stars.push(star);
    }

    function updateStars() {
        if (enableAnimation) {
            for (const star of stars) {
                let top = parseFloat(star.dataset.top!);
                const speed = parseFloat(star.dataset.speed!);

                top -= speed;

                if (top < -10) {
                    star.style.transition = 'none';
                    randomizeStars(star);

                    star.getBoundingClientRect();

                    star.style.transition = '';
                    continue;
                }

                star.dataset.top = String(top);
                star.style.top = top + '%';
            }
        }

        requestAnimationFrame(updateStars);
    }

    updateStars();
});

let fontAnimationId: NodeJS.Timeout | any;
let letters: HTMLSpanElement[] = [];
let word: HTMLElement;
let fonts: string[] = [];
let fontIndex = 0;

function startFontAnimation() {
    clearInterval(fontAnimationId);
    fontAnimationId = setInterval(runFontAnimation, animationIntervalMs);
}

function runFontAnimation() {
    if (!enableAnimation) return;

    const currentFont = fonts[fontIndex];
    const currentFontWeight = pickRandom(['100', '200', '300', '400']);
    const currentFontStyle = pickRandom(['normal', 'italic']);

    const scale = enableOptimization ? randInt(75, 100) / baseFontSizePx : randInt(100, 150) / baseFontSizePx;

    for (const letter of letters) {
        letter.style.fontFamily = currentFont;
        letter.style.fontWeight = currentFontWeight;
        letter.style.fontStyle = currentFontStyle;
    }

    word.style.transform = `scale(${scale})`;

    fontIndex = (fontIndex + 1) % fonts.length;
}

document.addEventListener('DOMContentLoaded', () => {
    word = document.getElementById('lanzoor-letters')!;
    letters = Array.from(document.querySelectorAll('#lanzoor-letters span')).map((element) => element as HTMLSpanElement);

    fonts = ['JetBrains Mono', 'Geist', 'Space Grotesk', 'Fira Code', 'Fairfax HD', 'Brass Mono'];

    fontIndex = 0;

    for (const letter of letters) {
        letter.style.fontSize = baseFontSizePx + 'px';
        letter.style.display = 'inline-block';
        letter.style.transformOrigin = 'center';
    }

    function startFontAnimation() {
        clearInterval(fontAnimationId);

        fontAnimationId = setInterval(runFontAnimation, animationIntervalMs);
    }

    function runFontAnimation() {
        if (!enableAnimation) return;

        const currentFont = fonts[fontIndex];
        const currentFontWeight = pickRandom(['100', '200', '300', '400']);
        const currentFontStyle = pickRandom(['normal', 'italic']);

        const scale = enableOptimization ? randInt(75, 100) / baseFontSizePx : randInt(100, 150) / baseFontSizePx;

        for (const letter of letters) {
            letter.style.fontFamily = currentFont;
            letter.style.fontWeight = currentFontWeight;
            letter.style.fontStyle = currentFontStyle;
        }

        word.style.transform = `scale(${scale})`;

        fontIndex = (fontIndex + 1) % fonts.length;
    }
    startFontAnimation();
});
