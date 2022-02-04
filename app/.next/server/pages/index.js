(() => {
var exports = {};
exports.id = 405;
exports.ids = [405];
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

/***/ 1288:
/***/ ((module) => {

// Exports
module.exports = {
	"gridContainer": "Home_gridContainer__wVZ_P",
	"item": "Home_item__UrFES",
	"menuContainer": "Home_menuContainer__XR_1e",
	"searchbar": "Home_searchbar__2X21B",
	"header": "Home_header__GCVRv",
	"main": "Home_main__nLjiQ",
	"grid": "Home_grid__GxQ85",
	"add": "Home_add__e9_Zr",
	"name": "Home_name__Je8n6",
	"button": "Home_button__Zs7A2",
	"itemFooter": "Home_itemFooter__DPnbC",
	"title": "Home_title__T09hD",
	"footer": "Home_footer____T7K",
	"buy": "Home_buy__ZvRus",
	"buyBlocked": "Home_buyBlocked__78EPC"
};


/***/ }),

/***/ 3993:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ Home),
  "getStaticProps": () => (/* binding */ getStaticProps)
});

// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(997);
// EXTERNAL MODULE: ./styles/Home.module.css
var Home_module = __webpack_require__(1288);
var Home_module_default = /*#__PURE__*/__webpack_require__.n(Home_module);
// EXTERNAL MODULE: ./styles/Checkout.module.css
var Checkout_module = __webpack_require__(6338);
var Checkout_module_default = /*#__PURE__*/__webpack_require__.n(Checkout_module);
;// CONCATENATED MODULE: external "next/head"
const head_namespaceObject = require("next/head");
var head_default = /*#__PURE__*/__webpack_require__.n(head_namespaceObject);
// EXTERNAL MODULE: ./node_modules/next/link.js
var next_link = __webpack_require__(1664);
// EXTERNAL MODULE: ./node_modules/next/image.js
var next_image = __webpack_require__(5675);
// EXTERNAL MODULE: external "react-toastify"
var external_react_toastify_ = __webpack_require__(1187);
// EXTERNAL MODULE: ./node_modules/react-toastify/dist/ReactToastify.css
var ReactToastify = __webpack_require__(8819);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(6689);
;// CONCATENATED MODULE: ./modules/searchbar.js


function Searchbar({ className  }) {
    const { 0: hovering , 1: setHovering  } = (0,external_react_.useState)(false);
    return(/*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        className: className,
        onMouseEnter: ()=>setHovering(true)
        ,
        onMouseLeave: ()=>setHovering(false)
        ,
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx("input", {
                spellCheck: "false",
                onChange: (e)=>{
                    if (e.target.value.length > 0) console.log(e.target.value);
                },
                className: "focus:outline-none w-full",
                placeholder: "Suchen"
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("img", {
                draggable: "false",
                src: "/icon/search.svg",
                style: hovering ? {
                    "opacity": "1"
                } : {
                    "opacity": "0"
                }
            })
        ]
    }));
};

;// CONCATENATED MODULE: external "react-outside-click-handler"
const external_react_outside_click_handler_namespaceObject = require("react-outside-click-handler");
var external_react_outside_click_handler_default = /*#__PURE__*/__webpack_require__.n(external_react_outside_click_handler_namespaceObject);
;// CONCATENATED MODULE: ./modules/popup_menu.js



const menuDefaultStyle = {
    "zIndex": "99999",
    "transition": "opacity 1s",
    "display": "flex",
    "flexDirection": "column",
    "position": "absolute",
    "width": "fit-content",
    "padding": "1rem",
    "border": "gray solid",
    "backgroundColor": "white"
};
const iconDefaultStyle = {
    "height": "3rem",
    "width": "3rem"
};
function PopupMenu({ children , on , atElement , icon , open , onOpenChanged , className , style , menuClassName , menuStyle , iconClassName , iconStyle  }) {
    if (!icon) icon = '/icon/menu.svg';
    const menuMergedStyle = atElement === false ? merge(menuDefaultStyle, merge(menuStyle, {
        "right": "-2rem"
    })) : merge(menuDefaultStyle, menuStyle);
    const iconMergedStyle = merge(iconStyle, iconDefaultStyle);
    const { 0: visible , 1: setVisible  } = (0,external_react_.useState)(false);
    if (on === undefined) on = 'click';
    function changeVisible(value) {
        setVisible(value);
        if (typeof onOpenChanged === 'function') onOpenChanged(value);
    }
    (0,external_react_.useEffect)(()=>{
        changeVisible(open);
    }, [
        open
    ]);
    return(/*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        className: className,
        style: style,
        children: [
            typeof icon === 'string' ? on === 'hover' ? /*#__PURE__*/ jsx_runtime_.jsx("img", {
                className: iconClassName,
                style: iconMergedStyle,
                draggable: "false",
                src: icon,
                onClick: ()=>{
                    if (!visible) {
                        changeVisible(true);
                    }
                },
                onMouseEnter: ()=>changeVisible(true)
                ,
                onMouseLeave: ()=>changeVisible(false)
            }) : /*#__PURE__*/ jsx_runtime_.jsx("img", {
                className: iconClassName,
                style: iconMergedStyle,
                draggable: "false",
                src: icon,
                onClick: ()=>{
                    if (!visible) {
                        changeVisible(true);
                    }
                }
            }) : {
                icon
            },
            visible && children ? on === 'click' ? /*#__PURE__*/ jsx_runtime_.jsx(ClickMenu, {
                className: menuClassName,
                style: menuMergedStyle,
                changeVisible: changeVisible,
                content: children
            }) : /*#__PURE__*/ jsx_runtime_.jsx(Menu, {
                className: menuClassName,
                style: menuMergedStyle,
                content: children
            }) : null
        ]
    }));
};
function ClickMenu({ className , style , content , changeVisible  }) {
    return(/*#__PURE__*/ jsx_runtime_.jsx((external_react_outside_click_handler_default()), {
        onOutsideClick: ()=>setTimeout(()=>changeVisible(false)
            , 10)
        ,
        children: /*#__PURE__*/ jsx_runtime_.jsx(Menu, {
            className: className,
            style: style,
            content: content
        })
    }));
}
function Menu({ className , style , content  }) {
    return(/*#__PURE__*/ jsx_runtime_.jsx("nav", {
        className: className,
        style: style,
        children: content
    }));
}
function merge(obj1, obj2) {
    const result = {};
    if (obj1) Object.keys(obj1).forEach((key)=>result[key] = obj1[key]
    );
    if (obj2) Object.keys(obj2).forEach((key)=>result[key] = obj2[key]
    );
    return result;
}

;// CONCATENATED MODULE: ./database/index.js
var bufferedDB = undefined;
const data = {
    "products": [
        {
            "id": "8ee34078-149b-41ca-bde3-833abe80dc86",
            "name": "A4 Heft liniert mit Rand",
            "thumbnail": "/content/thumbnail/82b2074f-1288-4b5d-8ae7-4f90b3a47933.png",
            "price": "12.99"
        },
        {
            "id": "369a015f-2f26-49d9-bfd0-a2f84556fbb8",
            "name": "A4 Heft liniert ohne Rand",
            "thumbnail": "/content/thumbnail/82b2074f-1288-4b5d-8ae7-4f90b3a47933.png",
            "price": "12.99"
        },
        {
            "id": "e326e3aa-a781-40da-bf08-165f08b11d47",
            "name": "A4 Heft kariert mit Rand",
            "thumbnail": "/content/thumbnail/d6b75482-6a9c-4348-9269-ed28ab2fca9f.png",
            "price": "12.99"
        },
        {
            "id": "d90de1d8-8583-4970-b171-529c2b4dca8f",
            "name": "A4 Heft kariert ohne Rand",
            "thumbnail": "/content/thumbnail/d6b75482-6a9c-4348-9269-ed28ab2fca9f.png",
            "price": "12.99"
        },
        {
            "id": "b3e35f1e-e467-4a07-965d-0389963d2875",
            "name": "Blauer Umschlag A4",
            "thumbnail": "/content/thumbnail/695c8eac-dfc8-4d80-bd3f-5148aabbb60f.png",
            "price": "0.50"
        },
        {
            "id": "c01a5f89-7f65-459d-8197-96c0dbd8ff50",
            "name": "Rosa Umschlag A4",
            "thumbnail": "/content/thumbnail/8bb4dae9-a344-47f7-8d76-c3fc486a9732.png",
            "price": "0.50"
        },
        {
            "id": "fc15739a-5272-49c2-8d97-95712b3c73a0",
            "name": "Gr\xfcner Umschlag A4",
            "thumbnail": "/content/thumbnail/1f1abda5-d5b0-4ea5-82dc-78e6ee489249.png",
            "price": "0.50"
        },
        {
            "id": "a0cf24c4-8822-45a1-af09-d95c48b2290c",
            "name": "Gelber Umschlag A4",
            "thumbnail": "/content/thumbnail/b0000211-9c22-4e7b-a15b-e56d31f31865.png",
            "price": "0.50"
        }
    ]
};
function get(id) {
    return new Promise((resolve)=>{
        resolve(data[id]);
    });
}
function set(id, content) {
    return new Promise((resolve)=>{
        try {
            data[id] = content;
            resolve(true);
        } catch (e) {
            resolve(false);
        }
    });
}
function database(config) {
    if (!config) config = {};
    if (!bufferedDB || config.force) return new Promise((resolve)=>{
        bufferedDB = {
            "get": get,
            "set": set
        };
        resolve(bufferedDB);
    });
    else return bufferedDB;
};

;// CONCATENATED MODULE: ./pages/index.js












function Home({ data  }) {
    const [sessionId, setSessionId] = (0,external_react_.useState)(undefined);
    (0,external_react_.useEffect)(()=>{
        fetch("/api/checkout/create").then((res)=>res.json()
        ).then((json)=>setSessionId(json.sessionId)
        ).then(()=>console.log(sessionId)
        );
    }, []);
    const [products, setProducts] = (0,external_react_.useState)([]);
    const [spamTimer, setSpamTimer] = (0,external_react_.useState)();
    function addProduct(product) {
        (0,external_react_toastify_.toast)('Zum Warenkorb hinzugef\xfcgt!', {
            "theme": "dark",
            "icon": "🛒"
        });
        const a = products;
        a.push(product);
        setProducts(a);
        saveSession();
    }
    function removeProduct(product) {
        (0,external_react_toastify_.toast)('Vom Warenkorb entfernt!', {
            "theme": "dark",
            "icon": "🛒"
        });
        const a = products;
        a.pop(product);
        setProducts(a);
        saveSession();
    }
    function saveSession() {
        if (!sessionId) return;
        clearTimeout(spamTimer);
        setSpamTimer(()=>fetch(`/api/checkout/update/${sessionId}`, {
                "method": "PUT",
                "body": JSON.stringify({
                    "products": products
                })
            })
        , 2000);
    }
    return(/*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        className: (Home_module_default()).main,
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx((head_default()), {
                children: /*#__PURE__*/ jsx_runtime_.jsx("title", {
                    children: "Home | Schulshop"
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: (Home_module_default()).header,
                children: [
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                        className: (Home_module_default()).menuContainer,
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime_.jsxs)(PopupMenu, {
                                atElement: false,
                                icon: "/icon/shopping_cart.svg",
                                menuStyle: {
                                    "width": "20rem",
                                    "display": "flex",
                                    "flexDirection": "column",
                                    "alignItems": "center",
                                    "borderRadius": "1rem",
                                    "borderWidth": "2px",
                                    "boxShadow": "3px 3px 18px 1px rgba(0, 0, 0, 0.18)"
                                },
                                children: [
                                    /*#__PURE__*/ jsx_runtime_.jsx("h3", {
                                        children: "Warenkorb"
                                    }),
                                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                        className: (Home_module_default()).container,
                                        children: products.length > 0 ? products.map((product)=>{
                                            return(/*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                                className: (Checkout_module_default()).item,
                                                children: [
                                                    /*#__PURE__*/ jsx_runtime_.jsx("img", {
                                                        src: product.thumbnail,
                                                        className: (Checkout_module_default()).smallThumbnail
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
                                        }) : /*#__PURE__*/ jsx_runtime_.jsx("p", {
                                            children: "leer"
                                        })
                                    }),
                                    products.length > 0 ? /*#__PURE__*/ jsx_runtime_.jsx(next_link["default"], {
                                        href: `/checkout/${sessionId}`,
                                        children: /*#__PURE__*/ jsx_runtime_.jsx("a", {
                                            children: /*#__PURE__*/ jsx_runtime_.jsx("h3", {
                                                className: (Home_module_default()).buy,
                                                children: "Kaufen"
                                            })
                                        })
                                    }) : /*#__PURE__*/ jsx_runtime_.jsx("h3", {
                                        className: (Home_module_default()).buy + " " + (Home_module_default()).buyBlocked,
                                        children: "Kaufen"
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime_.jsxs)(PopupMenu, {
                                atElement: false,
                                icon: "/icon/menu.svg",
                                menuStyle: {
                                    "borderRadius": "1rem",
                                    "borderWidth": "2px",
                                    "boxShadow": "3px 3px 18px 1px rgba(0, 0, 0, 0.18)"
                                },
                                children: [
                                    /*#__PURE__*/ jsx_runtime_.jsx("a", {
                                        children: "Hier"
                                    }),
                                    /*#__PURE__*/ jsx_runtime_.jsx("a", {
                                        children: "kann"
                                    }),
                                    /*#__PURE__*/ jsx_runtime_.jsx("a", {
                                        children: "ihre"
                                    }),
                                    /*#__PURE__*/ jsx_runtime_.jsx("a", {
                                        children: "Werbung"
                                    }),
                                    /*#__PURE__*/ jsx_runtime_.jsx("a", {
                                        children: "stehen!"
                                    })
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("h1", {
                        onClick: ()=>setTimeout(()=>window.open('https://asg-er.de', '_blank').focus()
                            , 600)
                        ,
                        className: (Home_module_default()).title,
                        children: "ASG Schulshop"
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx(Searchbar, {
                        className: (Home_module_default()).searchbar
                    })
                ]
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: (Home_module_default()).gridContainer,
                children: /*#__PURE__*/ jsx_runtime_.jsx("div", {
                    className: (Home_module_default()).grid,
                    children: data.map((element)=>{
                        return(/*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                            className: (Home_module_default()).item,
                            children: [
                                /*#__PURE__*/ jsx_runtime_.jsx("h3", {
                                    className: (Home_module_default()).name,
                                    children: element.name
                                }),
                                /*#__PURE__*/ jsx_runtime_.jsx(next_image["default"], {
                                    src: element.thumbnail,
                                    width: "200%",
                                    height: "200%",
                                    alt: element.name
                                }),
                                /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                    className: (Home_module_default()).itemFooter,
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime_.jsxs)("p", {
                                            children: [
                                                element.price,
                                                "€"
                                            ]
                                        }),
                                        /*#__PURE__*/ jsx_runtime_.jsx("img", {
                                            draggable: false,
                                            src: "/icon/shopping_cart.svg",
                                            onClick: ()=>addProduct(element)
                                        })
                                    ]
                                })
                            ]
                        }, element.id));
                    })
                })
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: (Home_module_default()).footer
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
async function getStaticProps() {
    const db = await database();
    const data = await db.get('products');
    return {
        "props": {
            data
        },
        "revalidate": 10
    };
}


/***/ }),

/***/ 562:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/denormalize-page-path.js");

/***/ }),

/***/ 8028:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/image-config.js");

/***/ }),

/***/ 4957:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/head.js");

/***/ }),

/***/ 4014:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/i18n/normalize-locale-path.js");

/***/ }),

/***/ 8020:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/mitt.js");

/***/ }),

/***/ 4964:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router-context.js");

/***/ }),

/***/ 9565:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/get-asset-path-from-route.js");

/***/ }),

/***/ 4365:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/get-middleware-regex.js");

/***/ }),

/***/ 1428:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/is-dynamic.js");

/***/ }),

/***/ 1292:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/parse-relative-url.js");

/***/ }),

/***/ 979:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/querystring.js");

/***/ }),

/***/ 6052:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/resolve-rewrites.js");

/***/ }),

/***/ 4226:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/route-matcher.js");

/***/ }),

/***/ 5052:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/route-regex.js");

/***/ }),

/***/ 3018:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/to-base-64.js");

/***/ }),

/***/ 9232:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/utils.js");

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
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [730,578], () => (__webpack_exec__(3993)));
module.exports = __webpack_exports__;

})();