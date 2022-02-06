import sessions from '../../backend/sessions'

export default async function handler(req, res) {
    if(req.method === 'POST') {
        const body = JSON.parse(req.body);
        const auth = await new sessions.timedTask(() => {
            return sessions.auth(req.connection.remoteAddress, body)
        }, 5000).start();
        if(auth instanceof Error) return res.status(auth.status).json({"error": auth.message});
        res.json(auth)
    }else {
        res.status(400).end()
    }
}

// /api/login
// body: 
// {
//    "username": "user",
//    "password": "123"
//}
//
// -> {
//      "authenticated": true
//}