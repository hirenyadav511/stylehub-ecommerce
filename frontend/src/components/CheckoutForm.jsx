import React, { useState, useContext } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useAuth } from "@clerk/clerk-react";
import api, { setAuthToken } from "../utils/api";
import { CartContext } from "../context/CartContext";
import { formatPrice } from "../utils/formatters";

const CheckoutForm = ({ total, discountAmount, couponCode, shippingDetails, onBack }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("stripe"); // "stripe" or "cod"
  const { getToken } = useAuth();
  const { clearCart, cart } = useContext(CartContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setError(null);

    if (paymentMethod === "stripe") {
      if (!stripe || !elements) return;

      const cardElement = elements.getElement(CardElement);
      const { error: stripeError, paymentMethod: stripePaymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (stripeError) {
        setError(stripeError.message);
        setProcessing(false);
        return;
      }
    }

    try {
      const token = await getToken();
      setAuthToken(token);
      
      const orderData = {
        orderItems: cart.map((item) => ({
          productId: item.id,
          name: item.name || item.title,
          image: item.images?.[0] || item.image,
          size: item.size,
          color: item.color,
          quantity: item.qty,
          price: item.price
        })),
        shippingAddress: shippingDetails,
        totalAmount: total,
        paymentMethod: paymentMethod,
        paymentStatus: paymentMethod === "stripe" ? "paid" : "pending",
        couponCode: couponCode || null,
        discountAmount: discountAmount || 0
      };
      
      await api.post("/orders/place", orderData);
      
      clearCart();
      setProcessing(false);
      setSucceeded(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to place order");
      setProcessing(false);
    }
  };

  if (succeeded) {
    return (
      <div className="text-center py-5">
        <div className="mb-4">
          <i className="fa fa-check-circle text-success" style={{ fontSize: '4rem' }}></i>
        </div>
        <h3 className="text-uppercase fw-bold tracking-widest mb-3">Order Placed!</h3>
        <p className="text-muted mb-4">Your order has been successfully placed. Check your orders page for tracking.</p>
        <a href="/orders" className="btn btn-dark px-5 py-3 text-uppercase tracking-widest">View My Orders</a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="mb-4">
        <label className="text-muted small text-uppercase tracking-widest mb-3 d-block">Select Payment Method</label>
        <div className="row g-3">
          <div className="col-6">
            <div 
              className={`p-3 border text-center cursor-pointer ${paymentMethod === "stripe" ? "border-dark bg-light" : ""}`}
              onClick={() => setPaymentMethod("stripe")}
              style={{ cursor: 'pointer' }}
            >
              <i className="fa fa-credit-card mb-2 d-block"></i>
              <span className="small text-uppercase fw-bold tracking-tighter">Online Card</span>
            </div>
          </div>
          <div className="col-6">
            <div 
              className={`p-3 border text-center cursor-pointer ${paymentMethod === "cod" ? "border-dark bg-light" : ""}`}
              onClick={() => setPaymentMethod("cod")}
              style={{ cursor: 'pointer' }}
            >
              <i className="fa fa-money mb-2 d-block"></i>
              <span className="small text-uppercase fw-bold tracking-tighter">Cash on Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {paymentMethod === "stripe" && (
        <div className="mb-4">
          <label className="text-muted small text-uppercase tracking-widest mb-2 d-block">Card Details</label>
          <div className="p-3 border">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#000",
                    "::placeholder": { color: "#aab7c4" },
                    fontFamily: 'Inter, sans-serif'
                  },
                  invalid: { color: "#9e2146" },
                },
              }}
            />
          </div>
        </div>
      )}

      {error && <div className="alert alert-danger small mb-4">{error}</div>}

      <div className="row g-3 mt-4 border-top pt-4">
        <div className="col-md-6">
          <button type="button" onClick={onBack} disabled={processing} className="btn btn-outline-dark w-100 py-3 text-uppercase tracking-widest">Back</button>
        </div>
        <div className="col-md-6">
          <button
            disabled={processing}
            className="btn btn-dark w-100 py-3 text-uppercase tracking-widest"
          >
            {processing ? "PROCESSING..." : `PLACE ORDER (${formatPrice(total)})`}
          </button>
        </div>
      </div>
      <p className="text-center text-muted small mt-4 mb-0 text-uppercase tracking-tighter" style={{ fontSize: '0.6rem' }}>
        By placing an order, you agree to our terms and conditions.
      </p>
    </form>
  );
};

export default CheckoutForm;
