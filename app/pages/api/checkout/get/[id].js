import sessions from '../../../../backend/sessions'

export default async function handler(req, res) {
    if(req.method === 'GET') {
        const {id} = req.query;
        const session = await new sessions.timedTask(() => {
            return sessions.get(id)
        }, 5000).start();
        if(session instanceof Error) return res.status(session.status).json({"error": session.message});
        res.json({"products": session.products})
    }else {
        res.status(400).end()
    }
}

// /api/checkout/create

//-> {
//      "products": []   
//}