import React, { useContext } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CartContext } from "../context/CartContext";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const Checkout = () => {
  const { cart } = useContext(CartContext);
  const total = cart.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h3 className="mb-4">Order Summary</h3>
              <ul className="list-group list-group-flush mb-4">
                {cart.map((item) => (
                  <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="my-0">{(item.title || item.name || 'Untitled').substring(0, 20)}...</h6>
                      <small className="text-muted">Qty: {item.qty}</small>
                    </div>
                    <span className="text-muted">${(item.qty * item.price).toFixed(2)}</span>
                  </li>
                ))}
                <li className="list-group-item d-flex justify-content-between">
                  <span>Total (USD)</span>
                  <strong>${total}</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <Elements stripe={stripePromise}>
            <CheckoutForm total={total} />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
