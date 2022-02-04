"use strict";
(() => {
var exports = {};
exports.id = 756;
exports.ids = [756];
exports.modules = {

/***/ 9420:
/***/ ((module) => {

module.exports = require("biguint-format");

/***/ }),

/***/ 3876:
/***/ ((module) => {

module.exports = require("flake-idgen");

/***/ }),

/***/ 7773:
/***/ ((module) => {

module.exports = require("redis");

/***/ }),

/***/ 9887:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ handler)
/* harmony export */ });
/* harmony import */ var _backend_sessions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8029);

async function handler(req, res) {
    if (req.method === 'POST') {
        console.log(req.body);
    //}else res.status(400).end()
    } else {
        const session = await _backend_sessions__WEBPACK_IMPORTED_MODULE_0__/* ["default"].findAll */ .Z.findAll();
        res.json(session);
    }
}; /*

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


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [29], () => (__webpack_exec__(9887)));
module.exports = __webpack_exports__;

})();