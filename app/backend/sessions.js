import {createClient} from 'redis';

import intformat from 'biguint-format';
import FlakeId from 'flake-idgen';

import ApiError from './apiError';

import LogClient from '../backend/logger'
const logClient = LogClient.register('SessionManager');

const flake = new FlakeId();

const production = process.env['PRODUCTION'] === 'TRUE';

const username = process.env['USERNAME'] ? process.env['USERNAME'] : 'username'
const password = process.env['PASSWORD'] ? process.env['PASSWORD'] : 'password'

function connectClient() {
    return new Promise(async resolve => {
        const client = production ? createClient({"url": "redis://redis:6379"}) : createClient();
        client.on('error', (err) => {
            logClient.log('Failed to connect to redis!');
        });
        client.on('ready', () => {
            resolve(client);
        });
        await client.connect();
    })
}
connectClient()

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

function setSessionState(id, state) {
    if(!id) return new ApiError("no ID given!", "id-missing")
    if(state !== 'pending' || state !== 'completed' || state !== 'canceled') return new ApiError(`unknown state '${state}'!`, "unknown-state")
    return new Promise(async resolve => {
        const client = await connectClient();
        const value = await client.get(id);
        const previous = value.state
        value.state = state;
        var date = new Date();
        date.setHours(date.getHours() + 1)
        value.expireIn = date;
        await client.set(id, value);
        logClient.log(`Session state of ${id} changed from '${previous}' to '${state}'!`);
        resolve();
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

function createUserSession(ip) {
    if(!ip) return new ApiError("no IP given!", "ip-missing")
    return new Promise(async resolve => {
        const client = await connectClient();
        const ipDataRaw = await client.get(key(ip));
        if(ipDataRaw) return resolve({"authenticated": JSON.parse(ipDataRaw).authenticated});
        const now = new Date()
        const expired = new Date()
        expired.setHours(expired.getHours() + 1)
        await client.set(key(ip), JSON.stringify({
            "created": now,
            "expireIn": expired,
            "type": "user",
            "username": key(ip),
            "authenticated": false
        }));
        logClient.log(`UserSession created by ${key(ip)}!`);
        resolve({"authenticated": false})
    })
}

function authenticate(ip, login) {
    if(!ip) return new ApiError("no IP given!", "ip-missing")
    if(!login) return new ApiError("no login data given!", "login-missing")
    return new Promise(async resolve => {
        const client = await connectClient();
        const ipDataRaw = await client.get(key(ip));
        if(!ipDataRaw) return resolve(new ApiError("user session not found!", "usersession-notfound"))
        if(!(login.username === username && login.password === password)) return resolve({"authenticated": false})
        const now = new Date()
        const expired = new Date()
        expired.setHours(expired.getHours() + 96)
        await client.set(key(ip), JSON.stringify({
            "created": now,
            "expireIn": expired,
            "type": "user",
            "username": key(ip),
            "authenticated": true
        }));
        logClient.log(`${key(ip)} authenticated!`);
        resolve({"authenticated": true})
    })
}

function createSession(ip) {
    if(!ip) return new ApiError("no IP given!", "id-missing")
    return new Promise(async resolve => {
        const client = await connectClient();
        const ipDataRaw = await client.get(key(ip));
        const ipData = JSON.parse(ipDataRaw)
        if(!ipDataRaw) return new ApiError("not authenticated!", "not-auth")
        else if(!ipData.authenticated) return new ApiError("not authenticated!", "not-auth")
        if(ipData.sessionId) {
            const sessionRaw = await client.get(ipData.sessionId)
            if(sessionRaw) {
                const session = JSON.parse(sessionRaw)
                session.sessionId = ipData.sessionId
                return resolve(session);
            }
        }
        const sessionId = intformat(flake.next(), 'dec');
        const now = new Date()
        const expired = new Date()
        expired.setHours(expired.getHours() + 1)
        const result = {
            "created": now,
            "expireIn": expired,
            "ip": ip,
            "state": "pending",
            "products": [],
            "type": "session"
        }
        await client.set(sessionId, JSON.stringify(result));
        ipData.sessionId = sessionId;
        await client.set(key(ip), JSON.stringify(ipData))
        logClient.log(`Session created by ${key(ip)}. ID: ${sessionId}`);
        result.sessionId = sessionId;
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
    "create": createSession,
    "findAll": findAllSessions,
    "setState": setSessionState,
    "kill": removeSession,
    "killUser": removeUserSession,
    "collectExpired": collectExpiredSessions,
    "update": updateSession,
    "get": getSession,
    "login": createUserSession,
    "auth": authenticate,
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