import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_API}/api/productRoutes/cart`,
          { withCredentials: true }
        );

        const cartData = res.data.map((item) => ({
          id: item._id,
          name: item.product.name,
          image: item.product.image,
          price: item.product.price,
          quantity: item.quantity,
          color: item.product.color,
          size: item.product.size,
        }));

        setCartItems(cartData);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      }
    };

    fetchCartItems();
  }, []);

  return (
    <CartContext.Provider value={{ cartItems, setCartItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
