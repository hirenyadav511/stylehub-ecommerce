import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { NavLink } from "react-router-dom";

const Cart = () => {
  const { cart, delItem, updateQty } = useContext(CartContext);

  const handleMinus = (item) => {
    if (item.qty > 1) {
      updateQty(item.id, item.qty - 1);
    } else {
      delItem(item);
    }
  };

  const handlePlus = (item) => {
    updateQty(item.id, item.qty + 1);
  };

  const cartItems = (item) => {
    return (
      <div className="px-4 my-5 bg-light rounded-3" key={item.id}>
        <div className="container py-4">
          <button
            onClick={() => delItem(item)}
            className="btn-close float-end"
            aria-label="Close"
          ></button>
          <div className="row justify-content-center">
            <div className="col-md-4">
              <img
                src={item.image}
                alt={item.title}
                height="200px"
                width="180px"
              />
            </div>
            <div className="col-md-4">
              <h3>{item.title}</h3>
              <p className="lead fw-bold">
                {item.qty} X ${item.price} = ${ (item.qty * item.price).toFixed(2) }
              </p>
              <button
                className="btn btn-outline-dark me-4"
                onClick={() => handleMinus(item)}
              >
                <i className="fa fa-minus"></i>
              </button>
              <button
                className="btn btn-outline-dark"
                onClick={() => handlePlus(item)}
              >
                <i className="fa fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const emptyCart = () => {
    return (
      <div className="px-4 my-5 bg-light rounded-3 py-5">
        <div className="container py-4 text-center">
          <h3>Your Cart is Empty</h3>
          <NavLink to="/products" className="btn btn-outline-dark mt-3">
            Go to Shop
          </NavLink>
        </div>
      </div>
    );
  };

  const total = cart.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2);

  const checkoutButton = () => {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12 text-center mb-5">
            <h2 className="mb-4">Total: ${total}</h2>
            <NavLink to="/checkout" className="btn btn-outline-dark px-4 py-2">
              Proceed To Checkout
            </NavLink>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {cart.length === 0 && emptyCart()}
      {cart.length !== 0 && cart.map(cartItems)}
      {cart.length !== 0 && checkoutButton()}
    </>
  );
};

export default Cart;