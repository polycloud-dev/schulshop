"use strict";
(() => {
var exports = {};
exports.id = 318;
exports.ids = [318];
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

/***/ 430:
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
        const session = await _backend_sessions__WEBPACK_IMPORTED_MODULE_0__/* ["default"].create */ .Z.create(req.socket.remoteAddress);
        res.json(session);
        setTimeout(()=>{
            _backend_sessions__WEBPACK_IMPORTED_MODULE_0__/* ["default"].collectExpired */ .Z.collectExpired();
        }, 10000);
    }
};


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [29], () => (__webpack_exec__(430)));
module.exports = __webpack_exports__;

})();