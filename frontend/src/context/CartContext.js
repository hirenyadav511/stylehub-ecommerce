import React, { createContext, useReducer, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import api, { setAuthToken } from "../utils/api";

// Initial state
const initialState = JSON.parse(localStorage.getItem("cart")) || [];

// Action Types
const ADD_ITEM = "ADD_ITEM";
const DEL_ITEM = "DEL_ITEM";
const UPDATE_QTY = "UPDATE_QTY";
const SET_CART = "SET_CART";
const CLEAR_CART = "CLEAR_CART";

// Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case SET_CART:
      return action.payload;

    case CLEAR_CART:
      return [];

    case ADD_ITEM:
      const product = action.payload;
      const exist = state.find((x) => x.id === product.id);
      if (exist) {
        return state.map((x) =>
          x.id === product.id ? { ...x, qty: x.qty + 1 } : x
        );
      } else {
        return [...state, { ...product, qty: 1 }];
      }

    case DEL_ITEM:
      return state.filter((x) => x.id !== action.payload.id);

    case UPDATE_QTY:
      return state.map((x) =>
        x.id === action.payload.id ? { ...x, qty: action.payload.qty } : x
      );

    default:
      return state;
  }
};

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [loading, setLoading] = useState(false);
  const { getToken, isSignedIn } = useAuth();

  // Load backend cart on login
  useEffect(() => {
    const fetchCart = async () => {
      if (isSignedIn) {
        setLoading(true);
        try {
          const token = await getToken();
          setAuthToken(token);
          const { data } = await api.get("/cart");
          
          // Map backend cart format to frontend format
          const mappedCart = data.products.map(item => ({
            ...item.productId,
            id: item.productId._id,
            qty: item.quantity
          }));
          
          dispatch({ type: SET_CART, payload: mappedCart });
        } catch (error) {
          console.error("Error fetching cart from backend:", error);
        } finally {
          setLoading(false);
        }
      } else {
        // If logged out, clear cart and localStorage
        dispatch({ type: CLEAR_CART });
        localStorage.removeItem("cart");
      }
    };
    fetchCart();
  }, [isSignedIn, getToken]);

  // Sync with localStorage (fallback)
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state));
  }, [state]);

  const addItem = async (product) => {
    dispatch({ type: ADD_ITEM, payload: product });
    if (isSignedIn) {
      try {
        const token = await getToken();
        setAuthToken(token);
        await api.post("/cart", { productId: product.id, quantity: 1 });
      } catch (error) {
        console.error("Error adding to cart on backend:", error);
      }
    }
  };

  const delItem = async (product) => {
    dispatch({ type: DEL_ITEM, payload: product });
    if (isSignedIn) {
      try {
        const token = await getToken();
        setAuthToken(token);
        await api.delete(`/cart/${product.id}`);
      } catch (error) {
        console.error("Error removing from cart on backend:", error);
      }
    }
  };

  const updateQty = (id, qty) => {
    dispatch({ type: UPDATE_QTY, payload: { id, qty } });
  };

  const clearCart = () => {
    dispatch({ type: CLEAR_CART });
  };

  return (
    <CartContext.Provider value={{ cart: state, addItem, delItem, updateQty, clearCart, loading }}>
      {children}
    </CartContext.Provider>
  );
};
