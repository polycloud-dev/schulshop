import sessions from '../../../../backend/sessions'

export default async function handler(req, res) {
    if(req.method === 'PUT') {
        const {id} = req.query;
        const body = JSON.parse(req.body);
        const session = await new sessions.timedTask(() => {
            return sessions.update(id, body.products)
        }, 5000).start();
        if(session instanceof Error) return res.status(session.status).json({"error": session.message});
        res.json(session)
    }else {
        res.status(400).end()
    }
}

// /api/checkout/update/123
// body: 
// {
//    "products": ["1", "2", "3"]
//}