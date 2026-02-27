import type { VercelRequest, VercelResponse } from '@vercel/node';

function degreesToCardinal(degrees: number) {
    if (typeof degrees !== 'number' || isNaN(degrees)) {
        return 'Unavailable';
    }
    degrees = ((degrees % 360) + 360) % 360;
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
}

const weatherDescriptions: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        console.log('Ping invoked!', { method: req.method, url: req.url });

        const ipRes = await fetch('http://ip-api.com/json/');
        if (!ipRes.ok) throw new Error(`IP API error: ${ipRes.status}`);
        const ipData = await ipRes.json();
        const latitude = parseFloat(ipData.lat);
        const longitude = parseFloat(ipData.lon);

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode,wind_speed_10m,wind_direction_10m,relative_humidity_2m&timezone=auto`;
        const airUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=pm10,pm2_5&timezone=auto`;

        const [weatherRes, airRes] = await Promise.all([fetch(weatherUrl), fetch(airUrl)]);
        if (!weatherRes.ok) throw new Error(`Weather API error: ${weatherRes.status}`);
        if (!airRes.ok) throw new Error(`Air API error: ${airRes.status}`);

        const weatherData = await weatherRes.json();
        const airData = await airRes.json();

        const temperature = weatherData.current?.temperature_2m ?? 'N/A';
        const weatherCode = weatherData.current?.weathercode ?? 0;
        const weatherDescriptor = weatherDescriptions[weatherCode] || 'Unknown';
        const windSpeed = weatherData.current?.wind_speed_10m ?? 'N/A';
        const windDirection = weatherData.current?.wind_direction_10m ?? 0;
        const windDirectionDescriptor = degreesToCardinal(windDirection);
        const humidity = weatherData.current?.relative_humidity_2m ?? 'N/A';
        const pm10 = airData?.current?.pm10 ?? 'N/A';
        const pm2_5 = airData?.current?.pm2_5 ?? 'N/A';

        res.status(200).json({
            coordinates: { latitude, longitude },
            temperature,
            weatherCode,
            weatherDescriptor,
            wind: { speed: windSpeed, direction: windDirection, descriptor: windDirectionDescriptor },
            humidity,
            pm10,
            pm2_5,
        });
    } catch (err: any) {
        res.status(400).json({ ok: false, error: err.message });
    }
}
