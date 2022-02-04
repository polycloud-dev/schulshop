(() => {
var exports = {};
exports.id = 696;
exports.ids = [696];
exports.modules = {

/***/ 6338:
/***/ ((module) => {

// Exports
module.exports = {
	"container": "Checkout_container__HcASy",
	"item": "Checkout_item__AjAhT",
	"smallThumbnail": "Checkout_smallThumbnail__ilRdK",
	"name": "Checkout_name__TsXuO",
	"tag": "Checkout_tag__SAOrr",
	"close": "Checkout_close__LBBIh",
	"center": "Checkout_center__8DZcz",
	"main": "Checkout_main__2bwum",
	"payment": "Checkout_payment__072LZ"
};


/***/ }),

/***/ 9598:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ Checkout),
  "getServerSideProps": () => (/* binding */ getServerSideProps)
});

// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(997);
// EXTERNAL MODULE: ./styles/Checkout.module.css
var Checkout_module = __webpack_require__(6338);
var Checkout_module_default = /*#__PURE__*/__webpack_require__.n(Checkout_module);
// EXTERNAL MODULE: external "react-toastify"
var external_react_toastify_ = __webpack_require__(1187);
// EXTERNAL MODULE: ./node_modules/react-toastify/dist/ReactToastify.css
var ReactToastify = __webpack_require__(8819);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(6689);
;// CONCATENATED MODULE: external "redis"
const external_redis_namespaceObject = require("redis");
;// CONCATENATED MODULE: external "biguint-format"
const external_biguint_format_namespaceObject = require("biguint-format");
var external_biguint_format_default = /*#__PURE__*/__webpack_require__.n(external_biguint_format_namespaceObject);
;// CONCATENATED MODULE: external "flake-idgen"
const external_flake_idgen_namespaceObject = require("flake-idgen");
var external_flake_idgen_default = /*#__PURE__*/__webpack_require__.n(external_flake_idgen_namespaceObject);
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
        const client = production ? (0,external_redis_namespaceObject.createClient)({
            "url": "redis://redis:6379"
        }) : (0,external_redis_namespaceObject.createClient)();
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

;// CONCATENATED MODULE: ./pages/checkout/[id].js






function Checkout({ session , productsSession  }) {
    const { 0: products , 1: setProducts  } = (0,external_react_.useState)(productsSession);
    const { 0: spamTimer , 1: setSpamTimer  } = (0,external_react_.useState)();
    (0,external_react_.useEffect)(()=>{
        if (products.length === 0) setTimeout(()=>window.location.href = '/'
        , 1000);
    }, []);
    function removeProduct(product) {
        (0,external_react_toastify_.toast)('Vom Warenkorb entfernt!', {
            "theme": "dark",
            "icon": "🛒"
        });
        const a = products;
        a.pop(product);
        setProducts(a);
        saveSession();
        window.scrollTo(0, document.getElementById("productContainer").scrollHeight);
        if (products.length === 0) setTimeout(()=>window.location.href = '/'
        , 1000);
    }
    function saveSession() {
        if (!session) return;
        clearTimeout(spamTimer);
        setSpamTimer(()=>fetch(`/api/checkout/update/${session}`, {
                "method": "PUT",
                "body": JSON.stringify({
                    "products": products
                })
            })
        , 2000);
    }
    return(/*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        className: (Checkout_module_default()).center,
        children: [
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: (Checkout_module_default()).main,
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx("h2", {
                        children: "Warenkorb | Kaufen"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                        className: (Checkout_module_default()).container,
                        id: "productContainer",
                        children: [
                            products.length == 0 ? /*#__PURE__*/ jsx_runtime_.jsx("h2", {
                                children: "Leer"
                            }) : null,
                            products.map((product)=>{
                                return(/*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                    className: (Checkout_module_default()).item,
                                    children: [
                                        /*#__PURE__*/ jsx_runtime_.jsx("img", {
                                            src: product.thumbnail
                                        }),
                                        /*#__PURE__*/ jsx_runtime_.jsx("p", {
                                            className: (Checkout_module_default()).name,
                                            children: product.name
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime_.jsxs)("p", {
                                            className: (Checkout_module_default()).tag,
                                            children: [
                                                "Preis: ",
                                                /*#__PURE__*/ (0,jsx_runtime_.jsxs)("span", {
                                                    children: [
                                                        product.price,
                                                        "€"
                                                    ]
                                                })
                                            ]
                                        }),
                                        /*#__PURE__*/ jsx_runtime_.jsx("img", {
                                            className: (Checkout_module_default()).close,
                                            draggable: false,
                                            src: "/icon/close.svg",
                                            onClick: ()=>removeProduct(product)
                                        })
                                    ]
                                }, product.id));
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                        className: (Checkout_module_default()).payment,
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx("img", {
                                draggable: false,
                                alt: "Bild nicht gefunden",
                                src: "https://img.icons8.com/pastel-glyph/64/000000/pay.png"
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx("img", {
                                draggable: false,
                                alt: "Bild nicht gefunden",
                                src: "https://www.paypalobjects.com/webstatic/i/logo/rebrand/ppcom.svg"
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ jsx_runtime_.jsx(external_react_toastify_.ToastContainer, {
                position: "bottom-left",
                autoClose: 2000,
                hideProgressBar: true,
                newestOnTop: false,
                closeOnClick: true,
                rtl: false,
                pauseOnFocusLoss: true,
                draggable: true,
                pauseOnHover: true,
                limit: 6
            })
        ]
    }));
};
async function getServerSideProps(context) {
    const sessionId = context.query.id;
    const session = await new backend_sessions.timedTask(()=>{
        return backend_sessions.get(sessionId);
    }).start();
    if (session instanceof Error) {
        console.log(session.message);
        return {
            "props": {},
            "redirect": {
                "destination": "/error",
                "permanent": false
            }
        };
    }
    return {
        "props": {
            "session": sessionId,
            "productsSession": session.products
        }
    };
}


/***/ }),

/***/ 8819:
/***/ (() => {



/***/ }),

/***/ 6689:
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ 1187:
/***/ ((module) => {

"use strict";
module.exports = require("react-toastify");

/***/ }),

/***/ 997:
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__(9598));
module.exports = __webpack_exports__;

})();