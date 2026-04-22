import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { NavLink } from "react-router-dom";
import { formatPrice } from "../utils/formatters";

const Cart = () => {
  const { cart, delItem, updateQty, applyCoupon, discount, couponCode } = useContext(CartContext);
  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    return imagePath.startsWith("http")
      ? imagePath
      : `http://localhost:5001${imagePath}`;
  };

  const handleMinus = (item) => {
    if (item.qty > 1) {
      updateQty(item.id, item.size, item.color, item.qty - 1);
    } else {
      delItem(item);
    }
  };

  const handlePlus = (item) => {
    updateQty(item.id, item.size, item.color, item.qty + 1);
  };

  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    setCouponError("");
    setCouponLoading(true);
    try {
      await applyCoupon(couponInput, subtotal);
      alert("Coupon applied successfully!");
    } catch (err) {
      setCouponError(err.response?.data?.message || err.message);
    } finally {
      setCouponLoading(false);
    }
  };

  const cartItems = (item) => {
    return (
      <div className="px-4 my-5 bg-light rounded-3 shadow-sm border-0" key={`${item.id}-${item.size}-${item.color}`}>
        <div className="container py-4">
          <button
            onClick={() => delItem(item)}
            className="btn-close float-end"
            aria-label="Close"
          ></button>
          <div className="row justify-content-center align-items-center">
            <div className="col-md-4 text-center">
              <img
                src={getImageUrl(item.images?.[0] || item.image)}
                alt={item.name}
                className="img-fluid rounded"
                style={{ maxHeight: "200px", objectFit: "contain" }}
              />
            </div>
            <div className="col-md-4">
              <h3>{item.name || item.title || 'Untitled Product'}</h3>
              <div className="mb-2">
                <span className="badge bg-secondary me-2">Size: {item.size}</span>
                <span className="badge bg-info text-dark">Color: {item.color}</span>
              </div>
              <p className="lead fw-bold mb-3">
                {item.qty} X {formatPrice(item.price)} = {formatPrice(item.qty * item.price)}
              </p>
              <div className="d-flex align-items-center gap-2">
                <button
                  className="btn btn-outline-dark btn-sm rounded-circle"
                  onClick={() => handleMinus(item)}
                >
                  <i className="fa fa-minus"></i>
                </button>
                <span className="fs-5 fw-bold mx-2">{item.qty}</span>
                <button
                  className="btn btn-outline-dark btn-sm rounded-circle"
                  onClick={() => handlePlus(item)}
                >
                  <i className="fa fa-plus"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const emptyCart = () => {
    return (
      <div className="px-4 my-5 bg-light rounded-3 py-5 shadow-sm">
        <div className="container py-4 text-center">
          <h3 className="display-6">Your Cart is Empty</h3>
          <NavLink to="/products" className="btn btn-outline-dark mt-3 px-4 py-2">
            Go to Shop
          </NavLink>
        </div>
      </div>
    );
  };

  const subtotal = cart.reduce((acc, item) => acc + item.qty * item.price, 0);

  const cartSummary = () => {
    return (
      <div className="container mt-5">
        <div className="row justify-content-end">
          <div className="col-md-5">
            <div className="card shadow-sm border-0 p-4 mb-4">
              <h4 className="fw-bold mb-4">Promo Code</h4>
              <form onSubmit={handleCouponSubmit}>
                <div className="input-group">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Enter Coupon Code"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    disabled={!!couponCode}
                  />
                  <button 
                    className="btn btn-dark px-4" 
                    type="submit"
                    disabled={couponLoading || !!couponCode || !couponInput}
                  >
                    {couponLoading ? "Checking..." : "Apply"}
                  </button>
                </div>
                {couponError && <p className="text-danger small mt-2">{couponError}</p>}
                {couponCode && <p className="text-success small mt-2">Coupon <strong>{couponCode}</strong> applied!</p>}
              </form>
            </div>
          </div>
          
          <div className="col-md-5 offset-md-2">
            <div className="card shadow-sm border-0 p-4 bg-light">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="d-flex justify-content-between mb-2 text-success">
                  <span>Discount ({couponCode})</span>
                  <span>- {formatPrice(discount)}</span>
                </div>
              )}
              <hr />
              <div className="d-flex justify-content-between mb-4 fs-4 fw-bold">
                <span>Total</span>
                <span>{formatPrice(Number(subtotal) - Number(discount))}</span>
              </div>
              <NavLink to="/checkout" className="btn btn-dark w-100 py-3 fw-bold fs-5 shadow-sm">
                Proceed To Checkout
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white min-vh-100 py-5">
      <div className="container">
        <h1 className="fw-bold mb-5 text-center">Shopping Bag</h1>
        {cart.length === 0 ? emptyCart() : (
          <>
            {cart.map(cartItems)}
            {cartSummary()}
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;