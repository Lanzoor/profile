import { pingServer } from '../ping-server.js';

async function sleep(timeMs: number): Promise<any> {
    return new Promise((p) => setTimeout(p, timeMs));
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
