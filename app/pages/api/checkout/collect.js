import sessions from '../../../backend/sessions'

export default async function handler(req, res) {
    if(req.method === 'POST') {
        const session = await new sessions.timedTask(() => {
            return sessions.collectExpired();
        }, 5000).start();
        if(session instanceof Error) return res.status(session.status).json({"error": session.message});
        res.json(session)
    }else {
        res.status(400).end()
    }
}

// /api/checkout/collect

//-> 200