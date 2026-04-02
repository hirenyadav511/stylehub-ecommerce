import React, { useState, useContext } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useAuth } from "@clerk/clerk-react";
import api, { setAuthToken } from "../utils/api";
import { CartContext } from "../context/CartContext";

const CheckoutForm = ({ total }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const { getToken } = useAuth();
  // We'll need access to the context to potentially refresh it after order
  const { clearCart, cart } = useContext(CartContext);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const cardElement = elements.getElement(CardElement);

    const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (stripeError) {
      setError(stripeError.message);
      setProcessing(false);
    } else {
      try {
        // Place order on backend
        const token = await getToken();
        setAuthToken(token);
        
        const orderData = {
          orderItems: cart.map((item) => ({
            productId: item.id,
            quantity: item.qty,
            price: item.price
          })),
          totalAmount: total,
          paymentStatus: "paid"
        };
        
        await api.post("/orders/place", orderData);
        
        clearCart();
        setError(null);
        setProcessing(false);
        setSucceeded(true);
        console.log("[PaymentMethod]", paymentMethod);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to place order");
        setProcessing(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-white">
      <h3 className="mb-4">Payment Details</h3>
      <div className="mb-4">
        <label htmlFor="card-element" className="form-label">Credit or debit card</label>
        <div className="p-3 border rounded">
          <CardElement
            id="card-element"
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
          />
        </div>
      </div>
      {error && <div className="alert alert-danger mb-4">{error}</div>}
      {succeeded ? (
        <div className="alert alert-success mb-4">
          Payment Succeeded! Thank you for your purchase.
        </div>
      ) : (
        <button
          disabled={!stripe || processing || succeeded}
          className="btn btn-dark w-100 py-2"
        >
          {processing ? "Processing..." : `Pay $${total}`}
        </button>
      )}
    </form>
  );
};

export default CheckoutForm;
