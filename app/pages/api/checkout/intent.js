import sessions from '../../../backend/sessions'

export default async function handler(req, res) {
    if(req.method === 'POST') {
        const body = JSON.parse(req.body);
        const session = await new sessions.timedTask(() => {
            return sessions.createIntent(req.connection.remoteAddress, body.products)
        }, 5000).start();
        if(session instanceof Error) return res.status(session.status).json({"error": session.message});
        res.json(session)
    }else {
        res.status(400).end()
    }
}