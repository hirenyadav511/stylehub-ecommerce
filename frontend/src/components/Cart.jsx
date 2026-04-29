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
      : `${process.env.REACT_APP_API_URL}${imagePath}`;
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
    } catch (err) {
      setCouponError(err.response?.data?.message || err.message);
    } finally {
      setCouponLoading(false);
    }
  };

  const cartItems = (item) => {
    return (
      <div className="py-4 border-bottom" key={`${item.id}-${item.size}-${item.color}`}>
        <div className="row align-items-center g-3">
          <div className="col-4 col-md-2">
            <div className="bg-light overflow-hidden" style={{ height: '140px', borderRadius: '8px' }}>
              <img
                src={getImageUrl(item.images?.[0] || item.image)}
                alt={item.name}
                className="w-100 h-100 object-fit-contain"
              />
            </div>
          </div>
          <div className="col-8 col-md-5">
            <h6 className="text-uppercase fw-bold mb-1">{item.name || item.title || 'Untitled Product'}</h6>
            <div className="small text-muted text-uppercase tracking-widest mb-2">
              Size: {item.size} | Color: {item.color}
            </div>
            <div className="d-flex align-items-center gap-3">
              <div className="d-flex align-items-center border px-2 py-1">
                <button
                  className="btn btn-link text-dark p-0 text-decoration-none"
                  onClick={() => handleMinus(item)}
                >
                  <i className="fa fa-minus small"></i>
                </button>
                <span className="mx-3 small fw-bold">{item.qty}</span>
                <button
                  className="btn btn-link text-dark p-0 text-decoration-none"
                  onClick={() => handlePlus(item)}
                >
                  <i className="fa fa-plus small"></i>
                </button>
              </div>
              <button
                onClick={() => delItem(item)}
                className="btn btn-link text-muted small p-0 text-decoration-none text-uppercase tracking-tighter"
              >
                REMOVE
              </button>
            </div>
          </div>
          <div className="col-12 col-md-5 text-md-end mt-3 mt-md-0">
            <div className="fw-bold">{formatPrice(item.qty * item.price)}</div>
            <small className="text-muted">{item.qty} x {formatPrice(item.price)}</small>
          </div>
        </div>
      </div>
    );
  };

  const emptyCart = () => {
    return (
      <div className="py-5 text-center">
        <h3 className="text-uppercase tracking-widest mb-4">Your Shopping Bag is Empty</h3>
        <NavLink to="/products" className="btn btn-dark">
          CONTINUE SHOPPING
        </NavLink>
      </div>
    );
  };

  const subtotal = cart.reduce((acc, item) => acc + item.qty * item.price, 0);

  const cartSummary = () => {
    return (
      <div className="row mt-5 pt-4">
        <div className="col-12 col-md-6 mb-4 mb-md-0">
          <h6 className="text-uppercase fw-bold mb-3 tracking-widest">PROMO CODE</h6>
          <form onSubmit={handleCouponSubmit} className="d-flex gap-0" style={{ maxWidth: '400px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="ENTER CODE"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              disabled={!!couponCode}
              style={{ borderRight: 'none' }}
            />
            <button
              className="btn btn-dark px-4"
              type="submit"
              disabled={couponLoading || !!couponCode || !couponInput}
            >
              {couponLoading ? "..." : "APPLY"}
            </button>
          </form>
          {couponError && <p className="text-danger small mt-2">{couponError}</p>}
          {couponCode && <p className="text-success small mt-2 text-uppercase tracking-widest">Code Applied</p>}
        </div>

        <div className="col-12 col-md-5 offset-md-1">
          <div className="p-4 bg-light">
            <div className="d-flex justify-content-between mb-3 small text-uppercase tracking-wider">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="d-flex justify-content-between mb-3 small text-uppercase tracking-wider text-success">
                <span>Discount ({couponCode})</span>
                <span>- {formatPrice(discount)}</span>
              </div>
            )}
            <div className="d-flex justify-content-between mb-4 fs-5 fw-bold text-uppercase tracking-widest">
              <span>Total</span>
              <span>{formatPrice(Number(subtotal) - Number(discount))}</span>
            </div>
            <NavLink to="/checkout" className="btn btn-dark w-100 py-3 text-uppercase">
              PROCEED TO CHECKOUT
            </NavLink>
            <p className="text-center text-muted small mt-3 mb-0 text-uppercase tracking-tighter" style={{ fontSize: '0.65rem' }}>
              Shipping and taxes calculated at checkout
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white min-vh-100 py-5 section-padding">
      <div className="container">
        <div className="text-center mb-5 pb-3">
          <h2 className="text-uppercase fw-bold tracking-widest">Shopping Bag</h2>
          <div className="mx-auto bg-dark" style={{ width: '40px', height: '2px' }}></div>
        </div>
        {cart.length === 0 ? emptyCart() : (
          <>
            <div className="mb-5">
              {cart.map(cartItems)}
            </div>
            {cartSummary()}
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
