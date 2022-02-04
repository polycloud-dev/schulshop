"use strict";
(() => {
var exports = {};
exports.id = 893;
exports.ids = [893];
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

/***/ 6254:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ handler)
/* harmony export */ });
/* harmony import */ var _backend_sessions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8029);

async function handler(req, res) {
    if (req.method === 'PUT') {
        const { id  } = req.query;
        const body = JSON.parse(req.body);
        const session = await new _backend_sessions__WEBPACK_IMPORTED_MODULE_0__/* ["default"].timedTask */ .Z.timedTask(()=>{
            return _backend_sessions__WEBPACK_IMPORTED_MODULE_0__/* ["default"].update */ .Z.update(id, body.products);
        }, 5000).start();
        if (session instanceof Error) return res.status(session.status).json({
            "error": session.message
        });
        res.json(session);
    } else {
        res.status(400).end();
    }
}; // /api/checkout/update/123
 // body: 
 // {
 //    "products": ["1", "2", "3"]
 //}


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [29], () => (__webpack_exec__(6254)));
module.exports = __webpack_exports__;

})();