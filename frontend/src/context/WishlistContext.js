import React, { createContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";
import api, { setAuthToken } from "../utils/api";
import { useNotification } from "./NotificationContext";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getToken, isSignedIn } = useAuth();
  const { showToast } = useNotification();

  const fetchWishlist = useCallback(async () => {
    if (isSignedIn) {
      setLoading(true);
      try {
        const token = await getToken();
        setAuthToken(token);
        const { data } = await api.get("/wishlist");
        const mappedData = data.products.map(p => ({
            ...p.productId,
            id: p.productId._id
        }));
        setWishlist(mappedData);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [isSignedIn, getToken]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleWishlist = async (product) => {
    if (!isSignedIn) return;
    try {
      const token = await getToken();
      setAuthToken(token);
      await api.post("/wishlist/toggle", { productId: product.id });
      
      setWishlist((prev) => {
        const exists = prev.find(item => item.id === product.id);
        if (exists) {
            return prev.filter(item => item.id !== product.id);
        } else {
            showToast("Added to wishlist");
            return [...prev, product];
        }
      });
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
};
