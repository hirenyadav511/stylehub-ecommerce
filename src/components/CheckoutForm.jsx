import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const CheckoutForm = ({ total }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    // In a real application, you would create a PaymentIntent on your server
    // and get a client_secret. Since we don't have a backend, we'll simulate
    // the payment process.
    
    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      setError(error.message);
      setProcessing(false);
    } else {
      setError(null);
      setProcessing(false);
      setSucceeded(true);
      console.log("[PaymentMethod]", paymentMethod);
      // alert("Payment Successful! Thank you for your purchase.");
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
