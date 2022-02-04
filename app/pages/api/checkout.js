import sessions from '../../backend/sessions'

export default async function handler(req, res) {
    if(req.method === 'POST') {
        console.log(req.body);
    //}else res.status(400).end()
    }else {
        const session = await sessions.findAll();
        res.json(session);
    }
}

/*

client: -> POST
{
    "shopping_cart": [
        {"id": 1, "quantity": 2},
        {"id": 2, "quantity": 1}
    ]
}

server:
//saves in database as
"<session-id>": {
    "id": "<uuidv4>",
    "shortId": "<eg. 1GL5>",
    "created": {<date>},
    "expireIn": {<date + 1h>}",
    "ip": "<client-ip>",
    "state": "pending",  (pending | completed | canceled)
    "products": [
        {"id": 1, "quantity": 2},
        {"id": 2, "quantity": 1}
    ]
}
//returns
{
    "sessionId": <session-id>
}

client: -> POST /checkout?session=<session-id>
{
    "shopping_cart": [
        {"id": 1, "quantity": 2},
        {"id": 3, "quantity": 1}
    ]
}

server:
//finds session object
//allows overridein pending only when ips matchs
/returns when not found or not allowed
{
    "error": "Not allowed to access this session!"
}
//saves in database as
"<old-session-id>": {
    "id": "<old-uuidv4>",
    "shortId": "<old-eg. 1GL5>",
    "created": {<old-date>},
    "expireIn": {<date + 1h>}",
    "ip": "<old-client-ip>",
    "state": "pending",
    "products": [
        {"id": 1, "quantity": 2},
        {"id": 3, "quantity": 1}
    ]
}
//returns
{
    "sessionId": <old-session-id>
}

//extend expirationTime (use case: eg. wish)
client: POST /checkout?session=<session-id>
{
    "extendExpiration": 1   //in hours, max. 8h
}
*/