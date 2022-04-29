import {createClient} from 'redis';

import Cookies from 'cookies'

import intformat from 'biguint-format';
import FlakeId from 'flake-idgen';

import ApiError from './apiError';

import LogClient from '../backend/logger'
const logClient = LogClient.register('SessionManager');

import {createIntent} from './payment';

const flake = new FlakeId();

const production = process.env['PRODUCTION'] === 'TRUE';

const username = process.env['USERNAME'] ? process.env['USERNAME'] : 'username'
const password = process.env['PASSWORD'] ? process.env['PASSWORD'] : 'password'

function connectClient() {
    return new Promise(async resolve => {
        const client = production ? createClient({"url": "redis://redis:6379"}) : createClient();
        client.on('error', (err) => {
            logClient.error('Failed to connect to redis!');
        });
        client.on('ready', () => {
            resolve(client);
        });
        await client.connect();
    })
}
connectClient()

function validateTracker(tracker, headers, keys) {
    if(!tracker) return false
    return new Promise(resolve => {
        for(const key of keys) {
            if(tracker[key] !== headers[key]) return resolve(false)
        }
        return resolve(true)
    })
}

const DEFAULT_TRACK_KEYS = ['ip', 'user-agent', 'accept-lang']

function track({context, keys, create, get}) {
    if(!keys) keys = DEFAULT_TRACK_KEYS;
    const cookie_key = 'session'
    return new Promise(async resolve => {
        const cookies = new Cookies(context.req, context.res)

        const headers = context.req.headers;
        headers.ip = context.req.connection.remoteAddress

        function onFailed() {
            if(!create) return undefined;
            return new Promise(async resolve => {
                const tracker = {}
                keys.forEach(key => tracker[key] = headers[key])
                const session = await create(tracker)
                cookies.set(cookie_key, session.id, {"sameSite": "strict", "expires": session.expireIn})
                return resolve(session)
            })
        }

        if(!cookies.get(cookie_key)) return resolve(await onFailed())
        const session_raw = await get(cookies.get(cookie_key))
        if(!session_raw) return resolve(await onFailed())
        const session = JSON.parse(session_raw)
        session.id = cookies.get(cookie_key)

        if(!(await validateTracker(session['tracker'], headers, keys))) return resolve(await onFailed())
        else return resolve(session)
    })
}

function findAllSessions() {
    return new Promise(async resolve => {
        const client = await connectClient();
        const result = []
        for await(const key of client.scanIterator()) {
            const value = await client.get(key)
            if(value.type === 'session') result.push(value)
        }
        resolve(result)
    })
}

function removeSession(id) {
    if(!id) return new ApiError("no ID given!", "id-missing")
    return new Promise(async resolve => {
        const client = await connectClient();
        const value = await client.get(id)
        if(!value) return resolve();
        await client.del(id)
        const ip = key(JSON.parse(value).ip);
        const userData = await client.get(ip)
        if(userData) {
            const user = JSON.parse(userData);
            user.sessionId = undefined
            await client.set(ip, JSON.stringify(user))
        }
        logClient.log(`Deleted Session ${id}!`);
        resolve()
    })
}

function removeUserSession(ip) {
    if(!ip) return new ApiError("no IP given!", "ip-missing")
    return new Promise(async resolve => {
        const client = await connectClient();
        const userRaw = await client.get(key(ip))
        if(!userRaw) return resolve(new ApiError("session not found!", "session-notfound"))
        const user = JSON.parse(userRaw)
        if(user.sessionId) await client.del(user.sessionId)
        logClient.log(`Deleted UserSession ${key(ip)}!`);
        resolve()
    })
}

function updateSession(id, products) {
    if(!id) return new ApiError("no ID given!", "id-missing")
    if(!products) return new ApiError("no products given!", "products-missing")
    return new Promise(async resolve => {
        const client = await connectClient();
        const res = await client.get(id);
        if(!res) return resolve(new ApiError("session not found!", "session-notfound"))
        const value = JSON.parse(res);
        value.products = products;
        var date = new Date();
        date.setHours(date.getHours() + 1)
        value.expireIn = date;
        await client.set(id, JSON.stringify(value));
        logClient.log(`Changed products of Session ${id}!`);
        resolve();
    })
}

/**
 * 
 * @param {*} context 
 * @returns {{
 *      created: date
 *      expireIn: date
 *      type: "user"
 *      authenticated: boolean
 *      'stripe-intent': any
 *      session: string
 *      tracker: any
 *      history: [any]
 *  }}
 */
function createUserSession(context) {
    if(!context) return new ApiError("no context given!", "ip-missing")
    return new Promise(async resolve => {
        const client = await connectClient();
        const session = await track({context,
            'create': async (tracker) => {
                return new Promise(async resolve => {
                    const userId = intformat(flake.next(), 'dec');
                    const now = new Date()
                    const expired = new Date()
                    expired.setHours(expired.getHours() + 1)
                    const session = await createSession()
                    logClient.log(`Session created by ${userId}. ID: ${session.id}`);
                    const result = {
                        "created": now,
                        "expireIn": expired,
                        "type": "user",
                        "authenticated": false,
                        "stripe-intent": undefined,
                        "session": session.id,
                        "tracker": tracker,
                        "history": []
                    }
                    await client.set(userId, JSON.stringify(result));
                    logClient.log(`UserSession created by ${userId}!`);
                    result.id = userId
                    resolve(result)
                })
            },
            'get': (id) => {
                return client.get(id) 
            }
        })
        return resolve(session)
    })
}

function createPaymentSession(context, user, paymentIntent) {
    if(!context) return new ApiError("no context given!", "ip-missing")
    if(!paymentIntent) return new ApiError("no paymentIntent given!", "paymentIntent-missing")
    if(!user) return new ApiError("no user given!", "user-missing")
    return new Promise(async resolve => {
        const client = await connectClient();
        const session = await track({context,
            'create': async () => {
                return new Promise(async resolve => {
                    const paymentId = intformat(flake.next(), 'dec');
                    const session = await createSession()
                    logClient.log(`Session created by ${userId}. ID: ${session.id}`);
                    const result = {
                        "created": now,
                        "type": "payment",
                        "user": user,
                        "amount": paymentIntent.amount,
                    }
                    await client.set(paymentId, JSON.stringify(result));
                    logClient.log(`UserSession created by ${userId}!`);
                    result.id = userId
                    resolve(result)
                })
            },
            'get': (id) => {
                return client.get(id) 
            }
        })
        return resolve(session)
    })
}

function authenticate(context, login) {
    if(!context) return new ApiError("no context given!", "ip-missing")
    if(!login) return new ApiError("no login data given!", "login-missing")
    return new Promise(async resolve => {
        const client = await connectClient();
        
        const user = await track({context, 'get': (id) => {
            return client.get(id)
        }})

        if(!user) return resolve(new ApiError("user session not found!", "usersession-notfound"))
        if(!(login.username === username && login.password === password)) return resolve({"authenticated": false})

        const expired = new Date()
        expired.setHours(expired.getHours() + 96)
        user.expired = expired

        user.authenticated = true

        const userId = user.id
        delete user.id

        await client.set(userId, JSON.stringify(user));
        logClient.log(`User ${userId} authenticated!`);

        resolve({"authenticated": true})
    })
}

function createStripeIntent(context, products, force=false) {
    if(!context) return new ApiError("no context given!", "ip-missing")
    if(!products) return new ApiError("no products given!", "products-missing")
    return new Promise(async resolve => {

        const client = await connectClient()

        const user = await track({context, 'get': (id) => {
            return client.get(id)
        }})

        if(!user) return resolve(new ApiError("user session not found!", "usersession-notfound"))

        if(user['stripe-intent'] !== undefined && !force) resolve(user['stripe-intent'])

        const expired = new Date()
        expired.setHours(expired.getHours() + 96)
        user.expired = expired

        user['stripe-intent'] = await createIntent(products)

        const userId = user.id
        delete user.id

        await client.set(userId, JSON.stringify(user))
        logClient.log(`User ${userId} requested intent!`);
        
        resolve(user['stripe-intent'])
    })
}

function removeStripeIntent(context) {
    if(!context) return new ApiError("no context given!", "ip-missing")
    return new Promise(async resolve => {
        const client = await connectClient()

        const user = await track({context, 'get': (id) => {
            return client.get(id)
        }})

        if(!user) return resolve(new ApiError("user session not found!", "usersession-notfound"))

        if(!user['stripe-intent']) return resolve(true);

        const session = await getSession(user.session)

        session.products = []

        await client.set(user.session, JSON.stringify(session))

        const expired = new Date()
        expired.setHours(expired.getHours() + 96)
        user.expired = expired

        user['stripe-intent'] = undefined

        const userId = user.id
        delete user.id

        await client.set(userId, JSON.stringify(user))
        logClient.log(`User ${userId} cleared intent!`);
        
        resolve(true)
    })
}

function confirmStripeIntent(context, payment_intent, payment_intent_client_secret) {
    if(!context) return new ApiError("no context given!", "ip-missing")
    if(!payment_intent) return new ApiError("no payment_intent given!", "payment_intent-missing")
    if(!payment_intent_client_secret) return new ApiError("no payment_intent_client_secret given!", "payment_intent_client_secret-missing")
    return new Promise(async resolve => {
        const client = await connectClient()

        const user = await track({context, 'get': (id) => {
            return client.get(id)
        }})

        if(!user) return resolve(new ApiError("user session not found!", "usersession-notfound"))

        if(!user['stripe-intent']) return resolve(new ApiError("no stripe intent found!", "stripe-intent-notfound"))

        const session = await getSession(user.session)

        const intent = await confirmIntent(payment_intent, payment_intent_client_secret)

        if(intent.status === "succeeded") {
            session.products = []
            await client.set(user.session, JSON.stringify(session))
            logClient.log(`User ${user.id} confirmed intent!`);
            resolve(true)
        } else {
            logClient.log(`User ${user.id} failed to confirm intent!`);
            resolve(false)
        }
    })
}

function getUser(ip) {
    if(!id) return new ApiError("no IP given!", "ip-missing")
    return new Promise(async resolve => {
        const client = await connectClient();
        const value = await client.get(key(ip));
        if(!value) return resolve(new ApiError("user session not found!", "usersession-notfound"))
        resolve(JSON.parse(value));
    })
}

function createSession() {
    return new Promise(async resolve => {
        const client = await connectClient();
        const sessionId = intformat(flake.next(), 'dec');
        const now = new Date()
        const expired = new Date()
        expired.setHours(expired.getHours() + 1)
        const result = {
            "created": now,
            "expireIn": expired,
            "products": [],
            "type": "session"
        }
        await client.set(sessionId, JSON.stringify(result));
        result.id = sessionId;
        resolve(result)
    })
}

function findAll() {
    return new Promise(async resolve => {
        const client = await connectClient();
        const result = []
        for await(const key of client.scanIterator()) {
            const clientData = await client.get(key);
            const value = JSON.parse(clientData);
            value.id = key;
            result.push(value);
        }
        resolve(result);
    })
}

function collectExpiredSessions() {
    return new Promise(async resolve => {
        logClient.log('Collect expired sessions!');
        const entries = await findAll()
        const now = new Date().getTime();
        await entries.forEach(async entry => {
            const expireIn = Date.parse(entry.expireIn);
            if((isNaN(expireIn) || now >= Date.parse(entry.expireIn))) {
                if(entry.type === 'session') await removeSession(entry.id); 
                else if(entry.type === 'user') await removeUserSession(entry.id)
            }
        });
        resolve();
    })
}

function getSession(id) {
    if(!id) return new ApiError("no ID given!", "id-missing")
    return new Promise(async resolve => {
        const client = await connectClient();
        const value = await client.get(id);
        if(!value) return resolve(new ApiError("session not found!", "session-notfound"))
        resolve(JSON.parse(value));
    })
}

function key(ip) {
    return `ip${ip.replaceAll('.', '').replaceAll(':', '')}`
}

const sessions = {
    "connect": connectClient,
    "findAll": findAllSessions,
    "kill": removeSession,
    "killUser": removeUserSession,
    "collectExpired": collectExpiredSessions,
    "update": updateSession,
    "get": getSession,
    "login": createUserSession,
    "auth": authenticate,
    "getUser": getUser,
    "createIntent": createStripeIntent,
    "removeIntent": removeStripeIntent,
    "confirmIntent": confirmStripeIntent,
    "timedTask": class {
        constructor(task, time=5000) {
            this.task = task;
            this.time = time;
        }
        start() {
            return new Promise(async resolve => {
                this.worker = setTimeout(() => {
                    clearTimeout(this.worker)
                    resolve(new ApiError('Timed out!', "timeout", 504))
                }, this.time);
                const taskResult = await this.task()
                resolve(taskResult)
            })
        }
    } 
}
export default sessions;