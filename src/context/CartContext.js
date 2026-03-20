import React, { createContext, useReducer, useEffect } from "react";

// Initial state
const initialState = JSON.parse(localStorage.getItem("cart")) || [];

// Action Types
const ADD_ITEM = "ADD_ITEM";
const DEL_ITEM = "DEL_ITEM";
const UPDATE_QTY = "UPDATE_QTY";

// Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case ADD_ITEM:
      const product = action.payload;
      // Check if product already exists
      const exist = state.find((x) => x.id === product.id);
      if (exist) {
        // Increase quantity
        return state.map((x) =>
          x.id === product.id ? { ...x, qty: x.qty + 1 } : x
        );
      } else {
        // Add new product
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

// Create Context
export const CartContext = createContext();

// Provider Component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state));
  }, [state]);

  const addItem = (product) => {
    dispatch({ type: ADD_ITEM, payload: product });
  };

  const delItem = (product) => {
    dispatch({ type: DEL_ITEM, payload: product });
  };

  const updateQty = (id, qty) => {
    dispatch({ type: UPDATE_QTY, payload: { id, qty } });
  };

  return (
    <CartContext.Provider value={{ cart: state, addItem, delItem, updateQty }}>
      {children}
    </CartContext.Provider>
  );
};
