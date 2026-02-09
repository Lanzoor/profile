async function fetchPingAPI(): Promise<any | undefined> {
    try {
        const res = await fetch('/api/ping');

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

let lastUpdated: number | undefined;

async function updateServerStatus() {
    const fetchResult = await fetchPingAPI();
    if (fetchResult) {
        lastUpdated = fetchResult.time;
        serverStatus.textContent = '🟢 Online';
    } else {
        serverStatus.textContent = '🔴 Troublesome';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateServerStatus();
    setInterval(updateServerStatus, 20000);
});

function updateLastUpdatedDisplay() {
    if (lastUpdated) {
        const currentTime = Date.now();
        const differenceMs = currentTime - lastUpdated;

        const differenceSec = Math.floor(differenceMs / 1000);

        lastUpdatedDisplay.textContent = `${differenceSec} seconds ago`;
    } else {
        lastUpdatedDisplay.textContent = 'none yet';
    }

    requestAnimationFrame(updateLastUpdatedDisplay);
}

updateLastUpdatedDisplay();
