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
  const [paymentMethod, setPaymentMethod] = useState("stripe");

  const { getToken } = useAuth();
  const { clearCart, cart } = useContext(CartContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setError(null);

    if (paymentMethod === "stripe") {
      if (!stripe || !elements) return;

      const cardElement = elements.getElement(CardElement);

      const { error: stripeError } = await stripe.createPaymentMethod({
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
          price: item.price,
        })),
        shippingAddress: shippingDetails,
        totalAmount: total,
        paymentMethod,
        paymentStatus: paymentMethod === "stripe" ? "paid" : "pending",
        couponCode: couponCode || null,
        discountAmount: discountAmount || 0,
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
        <i className="fa fa-check-circle text-success" style={{ fontSize: "4rem" }}></i>
        <h3 className="mt-3">Order Placed!</h3>
        <p>Your order has been successfully placed.</p>
        <a href="/orders" className="btn btn-dark mt-3">
          View Orders
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">

      <div className="mb-4">
        <label className="d-block mb-2">Payment Method</label>

        <div className="row g-3">
          <div className="col-6">
            <div
              className={`p-3 border text-center ${paymentMethod === "stripe" ? "border-dark bg-light" : ""}`}
              onClick={() => setPaymentMethod("stripe")}
              style={{ cursor: "pointer" }}
            >
              Card Payment
            </div>
          </div>

          <div className="col-6">
            <div
              className={`p-3 border text-center ${paymentMethod === "cod" ? "border-dark bg-light" : ""}`}
              onClick={() => setPaymentMethod("cod")}
              style={{ cursor: "pointer" }}
            >
              Cash on Delivery
            </div>
          </div>
        </div>
      </div>

      {paymentMethod === "stripe" && (
        <div className="mb-4 p-3 border">
          <CardElement />
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3">
        <div className="col-6">
          <button type="button" onClick={onBack} disabled={processing} className="btn btn-outline-dark w-100">
            Back
          </button>
        </div>

        <div className="col-6">
          <button disabled={processing} className="btn btn-dark w-100">
            {processing ? "Processing..." : `Place Order (${formatPrice(total)})`}
          </button>
        </div>
      </div>

    </form>
  );
};

export default CheckoutForm;