import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    console.log('Ping invoked!', { method: req.method, url: req.url });

    const projectId = process.env.VERCEL_PROJECT_ID;
    const token = process.env.VERCEL_TOKEN;

    const response = await fetch(`https://api.vercel.com/v6/deployments?projectId=${projectId}&limit=1`, { headers: { Authorization: `Bearer ${token}` } });

    const data = await response.json();
    const latest = data.deployments[0];

    const body = {
        ok: true,
        message: 'Servers online! Pong 🏓',
        time: Date.now(),
        createdAt: latest.createdAt,
        url: latest.url,
    };

    res.status(200).json(body);
}
