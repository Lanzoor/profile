import type { IncomingMessage, ServerResponse } from 'http';

export default function handler(req: IncomingMessage, res: ServerResponse) {
    console.log('Ping invoked', { method: req.method, url: req.url });

    const body = JSON.stringify({
        ok: true,
        message: 'pong!',
        time: Date.now(),
    });

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(body);
}
