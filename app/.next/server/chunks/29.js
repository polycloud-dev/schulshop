"use strict";
exports.id = 29;
exports.ids = [29];
exports.modules = {

/***/ 8029:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": () => (/* binding */ backend_sessions)
});

// EXTERNAL MODULE: external "redis"
var external_redis_ = __webpack_require__(7773);
// EXTERNAL MODULE: external "biguint-format"
var external_biguint_format_ = __webpack_require__(9420);
var external_biguint_format_default = /*#__PURE__*/__webpack_require__.n(external_biguint_format_);
// EXTERNAL MODULE: external "flake-idgen"
var external_flake_idgen_ = __webpack_require__(3876);
var external_flake_idgen_default = /*#__PURE__*/__webpack_require__.n(external_flake_idgen_);
;// CONCATENATED MODULE: ./backend/apiError.js
class ApiError extends Error {
    constructor(msg, status = 400){
        super(msg);
        this.msg = msg;
        this.status = status;
    }
};

;// CONCATENATED MODULE: ./backend/logger.js
class LogClient {
    constructor(name){
        this.name = name;
    }
    static register(name) {
        return new LogClient(name);
    }
    log(msg) {
        const now = new Date();
        console.log(`[\x1b[36m${now.getDate()}.${now.getMonth()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}\x1b[0m] [\x1b[32m${this.name}\x1b[0m] ${msg}`);
    }
};

;// CONCATENATED MODULE: ./backend/sessions.js





const logClient = LogClient.register('SessionManager');
const flake = new (external_flake_idgen_default())();
const production = process.env['PRODUCTION'] === 'TRUE';
function connectClient() {
    return new Promise(async (resolve)=>{
        const client = production ? (0,external_redis_.createClient)({
            "url": "redis://redis:6379"
        }) : (0,external_redis_.createClient)();
        client.on('error', (err)=>{
            logClient.log('Failed to connect to redis!');
        });
        client.on('ready', ()=>{
            resolve(client);
        });
        await client.connect();
    });
}
connectClient();
function findAllSessions() {
    return new Promise(async (resolve)=>{
        const client = await connectClient();
        const result = [];
        for await (const key1 of client.scanIterator()){
            const value = await client.get(key1);
            if (value.type === 'session') result.push(value);
        }
        resolve(result);
    });
}
function removeSession(id) {
    if (!id) return new ApiError("no ID given!");
    return new Promise(async (resolve)=>{
        const client = await connectClient();
        const value = await client.get(id);
        await client.del(id);
        await client.del(key(value.ip));
        logClient.log(`Deleted Session ${id}!`);
        resolve();
    });
}
function setSessionState(id, state) {
    if (!id) return new ApiError("no ID given!");
    if (state !== 'pending' || state !== 'completed' || state !== 'canceled') return new ApiError(`unknown state '${state}'!`);
    return new Promise(async (resolve)=>{
        const client = await connectClient();
        const value = await client.get(id);
        const previous = value.state;
        value.state = state;
        var date = new Date();
        date.setHours(date.getHours() + 1);
        value.expireIn = date;
        await client.set(id, value);
        logClient.log(`Session state of ${id} changed from '${previous}' to '${state}'!`);
        resolve();
    });
}
function updateSession(id, products) {
    if (!id) return new ApiError("no ID given!");
    if (!products) return new ApiError("no products given!");
    return new Promise(async (resolve)=>{
        const client = await connectClient();
        const res = await client.get(id);
        if (!res) return resolve(new ApiError("session not found!"));
        const value = JSON.parse(res);
        value.products = products;
        var date = new Date();
        date.setHours(date.getHours() + 1);
        value.expireIn = date;
        await client.set(id, JSON.stringify(value));
        logClient.log(`Changed products of Session ${id}!`);
        resolve();
    });
}
function createSession(ip) {
    if (!ip) return new ApiError("no IP given!");
    return new Promise(async (resolve)=>{
        const client = await connectClient();
        const ipDataRaw = await client.get(key(ip));
        if (ipDataRaw) {
            const ipData = JSON.parse(ipDataRaw);
            const session = await client.get(ipData.sessionId);
            if (session) {
                logClient.log(`User '${ipData.username}' connected to session ${ipData.sessionId}!`);
                return resolve({
                    "sessionId": ipData.sessionId
                });
            }
        }
        const sessionId = external_biguint_format_default()(flake.next(), 'dec');
        const now = new Date();
        const expired = new Date();
        expired.setHours(expired.getHours() + 1);
        await client.set(sessionId, JSON.stringify({
            "created": now,
            "expireIn": expired,
            "ip": ip,
            "state": "pending",
            "products": [],
            "type": "session"
        }));
        await client.set(key(ip), JSON.stringify({
            "sessionId": sessionId
        }));
        logClient.log(`Session created by ${key(ip)}. ID: ${sessionId}`);
        resolve({
            "sessionId": sessionId,
            "type": "user",
            "username": key(ip)
        });
    });
}
function collectExpiredSessions() {}
function getSession(id) {
    if (!id) return new ApiError("no ID given!");
    return new Promise(async (resolve)=>{
        const client = await connectClient();
        const value = await client.get(id);
        if (!value) return resolve(new ApiError("session not found!"));
        resolve(JSON.parse(value));
    });
}
function key(ip) {
    return `ip${ip.replaceAll('.', '').replaceAll(':', '')}`;
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
        constructor(task, time = 5000){
            this.task = task;
            this.time = time;
        }
        start() {
            return new Promise(async (resolve)=>{
                this.worker = setTimeout(()=>{
                    clearTimeout(this.worker);
                    resolve(new ApiError('Timed out!', 504));
                }, this.time);
                const taskResult = await this.task();
                resolve(taskResult);
            });
        }
    }
};
/* harmony default export */ const backend_sessions = (sessions);


/***/ })

};
;