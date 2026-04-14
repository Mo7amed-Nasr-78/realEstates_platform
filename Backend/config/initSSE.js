import env from 'dotenv';
env.config();
let clients = new Map();

export const initSse = async (req, res) => {
    const accessToken = req.query.accessToken || '';
    let userId = '';

    try {
        const payload = JSON.parse(atob(accessToken.split(".")[1]));
        userId = payload.id;
    } catch {
        res.status(401);
        throw new Error('Unauthorized');
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader("Access-Control-Allow-Origin", process.env.FRONT_END_URL);

    // Ensure headers are flushed immediately
    if (res.flushHeaders) {
        res.flushHeaders();
    }

    clients.set(userId, res);
    console.log("client connected");

    req.on('close', () => {
        console.log('client disconnected');
        clients.delete(userId);
        res.end();
    });

}

export function getSseClients() {
    if (clients.length < 1) {
        throw new Error('no clients connected');
    }

    return clients;
}
