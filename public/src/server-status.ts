async function pingServer(): Promise<any | undefined> {
    try {
        const res = await fetch('/api/status');

        if (!res.ok) {
            console.error('Ping API failed:', res.status, res.statusText);
            return;
        }

        const jsonResult = await res.json();

        if (jsonResult.ok === true) {
            return jsonResult;
        } else {
            console.error('Ping API responded with error:', jsonResult);
            return;
        }
    } catch (err) {
        console.error('Ping API request error:', err);
        return;
    }
}

const serverStatus = document.getElementById('server-status')!;
const lastUpdatedDisplay = document.getElementById('last-updated')!;
const uptimeDisplay = document.getElementById('uptime-display')!;

let lastUpdated: number | undefined;

async function updateServerStatus() {
    const fetchResult = await pingServer();
    if (fetchResult) {
        uptimeDisplay.textContent = new Date(fetchResult.createdAt).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        serverStatus.textContent = '🟢 Online';
    } else {
        serverStatus.textContent = '🔴 Troublesome';
    }

    lastUpdated = Date.now();
}

document.addEventListener('DOMContentLoaded', () => {
    updateServerStatus();
    setInterval(updateServerStatus, 30000);
});

function updateLastUpdatedDisplay() {
    if (lastUpdated) {
        const currentTime = Date.now();
        const differenceMs = currentTime - lastUpdated;
        const differenceSec = Math.floor(differenceMs / 1000);

        lastUpdatedDisplay.textContent = `${differenceSec} seconds ago`;
    } else {
        lastUpdatedDisplay.textContent = 'not pinged yet';
    }

    requestAnimationFrame(updateLastUpdatedDisplay);
}

updateLastUpdatedDisplay();
