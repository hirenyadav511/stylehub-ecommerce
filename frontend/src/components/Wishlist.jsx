import React, { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";
import { NavLink } from "react-router-dom";
import { formatPrice } from "../utils/formatters";

const Wishlist = () => {
  const { wishlist, toggleWishlist, loading } = useContext(WishlistContext);
  const { addItem } = useContext(CartContext);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    return imagePath.startsWith("http")
      ? imagePath
      : `http://localhost:5001${imagePath}`;
  };

  if (loading) return <div className="container py-5 text-center">Loading Wishlist...</div>;

  return (
    <div className="container py-5">
      <h2 className="display-6 fw-bolder text-center mb-5">Your Wishlist</h2>
      {wishlist.length === 0 ? (
        <div className="text-center">
            <p className="lead">Your wishlist is empty.</p>
            <NavLink to="/products" className="btn btn-outline-dark">Go Shopping</NavLink>
        </div>
      ) : (
        <div className="row justify-content-center">
          {wishlist.map((product) => (
            <div key={product.id} className="col-md-3 mb-4">
              <div className="card h-100 text-center p-4">
                <img src={getImageUrl(product.image)} className="card-img-top" alt={product.title || product.name} height="250px" />
                <div className="card-body">
                  <h5 className="card-title mb-0">{(product.title || product.name || 'Untitled').substring(0, 12)}...</h5>
                  <p className="card-text lead fw-bold">{formatPrice(product.price)}</p>
                  <div className="d-flex justify-content-center gap-2">
                    <button className="btn btn-outline-dark" onClick={() => addItem(product)}>Add to Cart</button>
                    <button className="btn btn-danger" onClick={() => toggleWishlist(product)}>
                        <i className="fa fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
