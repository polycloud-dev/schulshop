import {createClient} from 'redis';

import intformat from 'biguint-format';
import FlakeId from 'flake-idgen';

import ApiError from './apiError';

import LogClient from '../backend/logger'
const logClient = LogClient.register('SessionManager');

const flake = new FlakeId();

const production = process.env['PRODUCTION'] === 'TRUE';

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
    if(!id) return new ApiError("no ID given!")
    return new Promise(async resolve => {
        const client = await connectClient();
        const value = await client.get(id)
        await client.del(id)
        await client.del(key(value.ip))
        logClient.log(`Deleted Session ${id}!`);
        resolve()
    })
}

function setSessionState(id, state) {
    if(!id) return new ApiError("no ID given!")
    if(state !== 'pending' || state !== 'completed' || state !== 'canceled') return new ApiError(`unknown state '${state}'!`)
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
    if(!id) return new ApiError("no ID given!")
    if(!products) return new ApiError("no products given!")
    return new Promise(async resolve => {
        const client = await connectClient();
        const res = await client.get(id);
        if(!res) return resolve(new ApiError("session not found!"))
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

function createSession(ip) {
    if(!ip) return new ApiError("no IP given!")
    return new Promise(async resolve => {
        const client = await connectClient();
        const ipDataRaw = await client.get(key(ip));
        if(ipDataRaw) {
            const ipData = JSON.parse(ipDataRaw);
            const session = await client.get(ipData.sessionId);
            if(session) {
                logClient.log(`User '${ipData.username}' connected to session ${ipData.sessionId}!`)
                return resolve({"sessionId": ipData.sessionId})
            }
        }
        const sessionId = intformat(flake.next(), 'dec');
        const now = new Date()
        const expired = new Date()
        expired.setHours(expired.getHours() + 1)
        await client.set(sessionId, JSON.stringify({
            "created": now,
            "expireIn": expired,
            "ip": ip,
            "state": "pending",
            "products": [],
            "type": "session"
        }));
        await client.set(key(ip), JSON.stringify({
            "sessionId": sessionId,
            "type": "user",
            "username": key(ip)
        }));
        logClient.log(`Session created by ${key(ip)}. ID: ${sessionId}`);
        resolve({
            "sessionId": sessionId,
            "type": "user",
            "username": key(ip)
        })
    })
}

function collectExpiredSessions() {

}

function getSession(id) {
    if(!id) return new ApiError("no ID given!")
    return new Promise(async resolve => {
        const client = await connectClient();
        const value = await client.get(id);
        if(!value) return resolve(new ApiError("session not found!"))
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
    "collectExpired": collectExpiredSessions,
    "update": updateSession,
    "get": getSession,
    "timedTask": class {
        constructor(task, time=5000) {
            this.task = task;
            this.time = time;
        }
        start() {
            return new Promise(async resolve => {
                this.worker = setTimeout(() => {
                    clearTimeout(this.worker)
                    resolve(new ApiError('Timed out!', 504))
                }, this.time);
                const taskResult = await this.task()
                resolve(taskResult)
            })
        }
    } 
}
export default sessions;