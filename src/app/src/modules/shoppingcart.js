import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export default function useShoppingCart() {
    return useContext(CartContext);
}

export function ShoppingCartProvider({ children }) {
    const [cart, setCart] = useState([]);

    function addToCart(item) {
        setCart([...cart, item]);
    }

    function removeFromCart(item) {
        setCart(cart.filter(i => i.id !== item.id));
    }

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart
        }}>
            {children}
        </CartContext.Provider>
    );
}