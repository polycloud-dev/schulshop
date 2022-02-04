import sessions from '../../backend/sessions'

export default async function handler(req, res) {
    if(req.method === 'POST') {
        console.log(req.body);
    //}else res.status(400).end()
    }else {
        const session = await sessions.create(req.socket.remoteAddress);
        res.json(session)
        setTimeout(() => {
            sessions.collectExpired()
        }, 10000)
    }
}