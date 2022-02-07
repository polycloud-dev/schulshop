import {set} from '../../../database/index'

export default async function handler(req, res) {
    if(req.headers.host.search(/(localhost)/i) !== 0) return res.redirect('/api/admin');
    const id = req.query.id;
    if(req.method === 'PUT') {
        const body = JSON.parse(req.body)
        set(id, body)
    }else if(req.method === 'DELETE') {
        del(id)
    }else {
        res.status(400).end()
    }
}

// /api/admin/[id]

//-> 200