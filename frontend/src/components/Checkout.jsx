import React, { useContext } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CartContext } from "../context/CartContext";
import CheckoutForm from "./CheckoutForm";
import { formatPrice } from "../utils/formatters";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const Checkout = () => {
  const { cart, discount, couponCode } = useContext(CartContext);
  const subtotal = cart.reduce((acc, item) => acc + item.qty * item.price, 0);
  const total = Math.max(0, Number(subtotal) - Number(discount));

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h3 className="mb-4 fw-bold">Order Summary</h3>
              <ul className="list-group list-group-flush mb-4">
                {cart.map((item) => (
                  <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center bg-transparent">
                    <div>
                      <h6 className="my-0">{(item.title || item.name || 'Untitled').substring(0, 20)}...</h6>
                      <small className="text-muted">Qty: {item.qty}</small>
                    </div>
                     <span className="text-muted">{formatPrice(item.qty * item.price)}</span>
                  </li>
                ))}
                {discount > 0 && (
                   <li className="list-group-item d-flex justify-content-between text-success bg-transparent">
                     <span>Discount ({couponCode})</span>
                    <strong>- {formatPrice(discount)}</strong>
                  </li>
                )}
                 <li className="list-group-item d-flex justify-content-between bg-transparent border-top mt-2">
                  <span className="fs-5 fw-bold">Total (INR)</span>
                  <strong className="fs-5">{formatPrice(total)}</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h3 className="mb-4 fw-bold">Payment Details</h3>
              <Elements stripe={stripePromise}>
                <CheckoutForm total={total} discountAmount={discount} couponCode={couponCode} />
              </Elements>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
