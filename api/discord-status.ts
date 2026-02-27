import type { VercelRequest, VercelResponse } from '@vercel/node';

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

        const userId = process.env.NEXT_PUBLIC_USER_ID;
        const lanyardURL = `https://api.lanyard.rest/v1/users/${userId}`;
        console.log(`Fetching from URL ${lanyardURL}`);

        const response = await fetch(lanyardURL);

        const data = await response.json();

        if (data.success == false && data.error) {
            throw new Error(`Lanyard API Error: ${data.error.message}`);
        }

        const body = {
            ok: true,
            time: Date.now(),
            data: data.data,
        };

        res.status(200).json(body);
    } catch (err: any) {
        res.status(400).json({ ok: false, error: err.message });
    }
}
