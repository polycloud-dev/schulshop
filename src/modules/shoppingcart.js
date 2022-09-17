import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export default function useShoppingCart() {
    return useContext(CartContext);
}

export function ShoppingCartProvider({ children }) {
    
    // cart example
    /*
        [
            {
                "id": "gopher",
                "type": "product",
                "quantity": 1,
            },
            {
                "id": "gopher-red",
                "type": "variant",
                "variant": {
                    "name": "red",
                    "image": "123.png"
                },
                "quantity": 1
            },
            {
                "id": "gophers".
                "type": "bundle",
                "content": [
                    {
                        "id": "gopher",
                        "type": "product",
                        "quantity": 1,
                    },
                    {
                        "id": "gopher_flash",
                        "type": "product",
                        "quantity": 1,
                    }
                ]
            }
        ]
    */
    const [cart, setCart] = useState([]);
    const [isOrdered, setIsOrdered] = useState(false);

    /*
        item = {
            id: string,
            type: string,
            content: {      // for bundle
                id: string,
                quantity: number,
            }   
        }
    */
    function addToCart(item, bundle=false) {
        if(!item) return false;
        // if item is a product
        if(item.type === "product" || item.type === 'variant') {
            if(!bundle) {
                // if item is already in cart, increase quantity
                const index = cart.findIndex(cartItem => cartItem.id === item.id);
                if(index !== -1) {
                    setCart([
                        ...cart.slice(0, index),
                        {
                            ...cart[index],
                            quantity: cart[index].quantity + 1,
                        },
                        ...cart.slice(index + 1),
                    ]);
                }else {
                    setCart([
                        ...cart,
                        {
                            ...item,
                            quantity: 1,
                        },
                    ]);
                }
            }else {
                // find bundle
                const bundleIndex = cart.findIndex(cartItem => cartItem.uniqueId === bundle.uniqueId && cartItem.type === "bundle");
                if(bundleIndex !== -1) return false;
                // find product
                const bundle = cart[bundleIndex];
                const productIndex = bundle.content.findIndex(bundleItem => bundleItem.id === item.id);
                if(productIndex !== -1) {
                    setCart([
                        ...cart.slice(0, bundleIndex),
                        {
                            ...bundle,
                            content: [
                                ...bundle.content.slice(0, productIndex),
                                {
                                    ...bundle.content[productIndex],
                                    quantity: bundle.content[productIndex].quantity + 1,
                                },
                                ...bundle.content.slice(productIndex + 1),
                            ],
                        },
                        ...cart.slice(bundleIndex + 1),
                    ]);
                }else {
                    setCart([
                        ...cart.slice(0, bundleIndex),
                        {
                            ...bundle,
                            content: [
                                ...bundle.content,
                                {
                                    ...item,
                                    quantity: 1,
                                },
                            ],
                        },
                        ...cart.slice(bundleIndex + 1),
                    ]);
                }
            }
        }else if(item.type === "bundle") {
            item.uniqueId = item.id + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            // add bundle
            setCart([
                ...cart,
                {
                    ...item,
                },
            ]);
        } else return false
        return true
    }

    function removeFromCart(item, bundle=false) {
        if(!item) return false;
        // if item is a product
        if(item.type === "product" || item.type === 'variant') {
            if(!bundle) {
                // if item is already in cart, decrease quantity
                const index = cart.findIndex(cartItem => cartItem.id === item.id);
                if(index !== -1) {
                    if(cart[index].quantity > 1) {
                        setCart([
                            ...cart.slice(0, index),
                            {
                                ...cart[index],
                                quantity: cart[index].quantity - 1,
                            },
                            ...cart.slice(index + 1),
                        ]);
                    }else {
                        setCart([
                            ...cart.slice(0, index),
                            ...cart.slice(index + 1),
                        ]);
                    }
                }
            }else {
                // find bundle
                const bundleIndex = cart.findIndex(cartItem => cartItem.uniqueId === bundle.uniqueId && cartItem.type === "bundle");
                if(bundleIndex === -1) return false;
                // find product
                const bundle = cart[bundleIndex];
                const productIndex = bundle.content.findIndex(bundleItem => bundleItem.id === item.id);
                if(productIndex === -1) return false;
                // remove product
                if(bundle.content[productIndex].quantity > 1) {
                    setCart([
                        ...cart.slice(0, bundleIndex),
                        {
                            ...bundle,
                            content: [
                                ...bundle.content.slice(0, productIndex),
                                {
                                    ...bundle.content[productIndex],
                                    quantity: bundle.content[productIndex].quantity - 1,
                                },
                                ...bundle.content.slice(productIndex + 1),
                            ],
                        },
                        ...cart.slice(bundleIndex + 1),
                    ]);
                } else {
                    // if bundle is empty, remove it
                    if(bundle.content.length <= 1) {
                        setCart([
                            ...cart.slice(0, bundleIndex),
                            ...cart.slice(bundleIndex + 1),
                        ]);
                    }else {
                        // remove product
                        setCart([
                            ...cart.slice(0, bundleIndex),
                            {
                                ...bundle,
                                content: [
                                    ...bundle.content.slice(0, productIndex),
                                    ...bundle.content.slice(productIndex + 1),
                                ],
                            },
                            ...cart.slice(bundleIndex + 1),
                        ]);
                    }
                }
            }
        } else return false
        return true
    }

    function setQuantity(item, quantity, bundle_parent=false) {
        if(!item) return false;
        // if item is a product
        if(item.type === "product" || item.type === 'variant') {
            // if bundle
            if(bundle_parent) {
                // find bundle
                const bundleIndex = cart.findIndex(cartItem => cartItem.uniqueId === bundle_parent.uniqueId && cartItem.type === "bundle");
                if(bundleIndex === -1) return false;

                // find product
                const bundle = cart[bundleIndex];
                const productIndex = bundle_parent.content.findIndex(bundleItem => bundleItem.id === item.id);
                if(productIndex === -1) return false;
                // set quantity
                if(quantity > 0) {
                    setCart([
                        ...cart.slice(0, bundleIndex),
                        {
                            ...bundle,
                            content: [
                                ...bundle.content.slice(0, productIndex),
                                {
                                    ...bundle.content[productIndex],
                                    quantity,
                                },
                                ...bundle.content.slice(productIndex + 1),
                            ],
                        },
                        ...cart.slice(bundleIndex + 1),
                    ]);
                }else if(quantity === 0) {
                    if(bundle.content.length <= 1) {
                        setCart([
                            ...cart.slice(0, bundleIndex),
                            ...cart.slice(bundleIndex + 1),
                        ]);
                    }else {
                        setCart([
                            ...cart.slice(0, bundleIndex),
                            {
                                ...bundle,
                                content: [
                                    ...bundle.content.slice(0, productIndex),
                                    ...bundle.content.slice(productIndex + 1),
                                ],
                            },
                            ...cart.slice(bundleIndex + 1),
                        ]);
                    }
                }
            }else {
                // if quantity is 0, remove from cart
                if(quantity === 0) {
                    setCart(cart.filter(cartItem => cartItem.id !== item.id));
                }else {
                    const index = cart.findIndex(cartItem => cartItem.id === item.id);
                    if(index !== -1) {
                        setCart([
                            ...cart.slice(0, index),
                            {
                                ...cart[index],
                                quantity: quantity,
                            },
                            ...cart.slice(index + 1),
                        ]);
                    }
                }
            }
        } else if(item.type === "bundle") {
            // remove bundle
            if(quantity === 0) {
                setCart(cart.filter(cartItem => cartItem.id !== item.id));
            }
        } else return false
        return true
    }

    function confirmOrder({ order_id, total_price }) {
        setIsOrdered({ordered: true, order_id, total_price});
        // reset cart
        setCart([]);
    }

    function rawCart() {
        const bundles = cart.filter(cartItem => cartItem.type === "bundle");
        const products = cart.filter(cartItem => cartItem.type === "product");
        const variants = cart.filter(cartItem => cartItem.type === "variant").map(variant => {
            return {
                'id': variant.product_id,
                'quantity': variant.quantity,
                'variant': variant.variant,
                'type': 'variant',
            }
        })

        // for(let i = 0; i < bundles.length; i++) {
        //     const bundle = bundles[i];
        //     for(let j = 0; j < bundle.content.length; j++) {
        //         const product = bundle.content[j];
        //         // if product is in cart, increase quantity
        //         const index = products.findIndex(cartItem => cartItem.id === product.id);
        //         if(index !== -1) {
        //             products[index].quantity += product.quantity;
        //         }else {
        //             products.push({'id': product.id, 'quantity': product.quantity});
        //         }
        //     }
        // }

        // merge products and variants
        return [...products, ...bundles, ...variants];
    }

    function size() {
        const products = cart.filter(cartItem => cartItem.type === "product" || cartItem.type === "variant");
        const bundles = cart.filter(cartItem => cartItem.type === "bundle");

        let size = 0;
        for(let i = 0; i < products.length; i++) {
            size += products[i].quantity;
        }

        size += bundles.length;

        return size;
    }

    function formatCurrency(price) {
        return (price/100).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            isOrdered,
            confirmOrder,
            getRawCart: rawCart,
            setQuantity,
            formatCurrency,
            size
        }}>
            {children}
        </CartContext.Provider>
    );
}