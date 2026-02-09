import type { IncomingMessage, ServerResponse } from 'http';
import { createHash } from 'crypto';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
    console.log('Ping invoked', { method: req.method, url: req.url });

    let bodyData = '';
    for await (const chunk of req) {
        bodyData += chunk;
    }

    let result: string | null = null;
    try {
        const parsed = JSON.parse(bodyData);
        if (parsed.text && typeof parsed.text === 'string') {
            result = createHash('sha256').update(parsed.text).digest('hex');
        }
    } catch (err) {
        console.error('Failed to parse body:', err);
    }

    const responseBody = JSON.stringify({
        ok: true,
        message: 'pong!',
        time: Date.now(),
        result,
    });

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(responseBody);
}
