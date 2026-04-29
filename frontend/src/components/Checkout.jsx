import React, { useState, useContext } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CartContext } from "../context/CartContext";
import CheckoutForm from "./CheckoutForm";
import { formatPrice } from "../utils/formatters";
import { NavLink } from "react-router-dom";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// Helper to get image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return "";
  return imagePath.startsWith("http")
    ? imagePath
    : `${process.env.REACT_APP_API_URL}${imagePath}`;
};

// --- Sub-components moved outside to prevent re-mounting on every keystroke ---

const StepIndicator = ({ currentStep }) => (
  <div className="d-flex justify-content-center align-items-center mb-5 gap-4">
    {[1, 2, 3].map((step) => (
      <div key={step} className="d-flex align-items-center">
        <div
          className={`rounded-circle d-flex align-items-center justify-content-center fw-bold ${currentStep === step ? "bg-dark text-white" : currentStep > step ? "bg-dark text-white" : "bg-light text-muted border"
            }`}
          style={{ width: "35px", height: "35px", fontSize: "0.8rem" }}
        >
          {step}
        </div>
        <div className="ms-2 text-uppercase tracking-widest small fw-bold" style={{ fontSize: '0.65rem' }}>
          {step === 1 ? "Summary" : step === 2 ? "Shipping" : "Payment"}
        </div>
        {step < 3 && <div className="ms-4 border-bottom" style={{ width: "40px" }}></div>}
      </div>
    ))}
  </div>
);

const ProductSummary = ({ cart, subtotal, discount, total, nextStep }) => (
  <div className="bg-white">
    <h5 className="text-uppercase fw-bold mb-4 tracking-widest">Order Summary</h5>
    <div className="mb-4">
      {cart.map((item) => (
        <div key={`${item.id}-${item.size}-${item.color}`} className="d-flex gap-3 mb-4 pb-4 border-bottom align-items-center">
          <div style={{ width: "80px", height: "100px" }} className="bg-light p-1">
            <img src={getImageUrl(item.images?.[0] || item.image)} alt={item.name} className="w-100 h-100 object-fit-contain" />
          </div>
          <div className="flex-grow-1">
            <h6 className="text-uppercase fw-bold small mb-1">{item.name || item.title}</h6>
            <div className="small text-muted text-uppercase tracking-tighter">Size: {item.size} | Color: {item.color}</div>
            <div className="small text-muted mt-1">Qty: {item.qty}</div>
          </div>
          <div className="fw-bold small">{formatPrice(item.qty * item.price)}</div>
        </div>
      ))}
    </div>
    <div className="bg-light p-4 mb-4">
      <div className="d-flex justify-content-between mb-2 small text-uppercase tracking-wider">
        <span>Subtotal</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      {discount > 0 && (
        <div className="d-flex justify-content-between mb-2 small text-uppercase tracking-wider text-success">
          <span>Discount</span>
          <span>- {formatPrice(discount)}</span>
        </div>
      )}
      <div className="d-flex justify-content-between fw-bold text-uppercase tracking-widest mt-2 border-top pt-2">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
    </div>
    <button onClick={nextStep} className="btn btn-dark w-100 py-3 text-uppercase tracking-widest">
      Continue to Shipping
    </button>
  </div>
);

const ShippingDetails = ({ shippingData, handleInputChange, nextStep, prevStep }) => (
  <div className="bg-white">
    <h5 className="text-uppercase fw-bold mb-4 tracking-widest">Shipping Information</h5>
    <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} className="row g-4">
      <div className="col-12">
        <label className="text-muted small text-uppercase tracking-widest mb-2">Full Name</label>
        <input type="text" name="fullName" value={shippingData.fullName} onChange={handleInputChange} className="form-control" placeholder="ENTER YOUR FULL NAME" minLength="3" maxLength="50" required />
      </div>
      <div className="col-12">
        <label className="text-muted small text-uppercase tracking-widest mb-2">Address</label>
        <input type="text" name="address" value={shippingData.address} onChange={handleInputChange} className="form-control" placeholder="STREET ADDRESS, APARTMENT, ETC." minLength="10" required />
      </div>
      <div className="col-md-6">
        <label className="text-muted small text-uppercase tracking-widest mb-2">City</label>
        <input type="text" name="city" value={shippingData.city} onChange={handleInputChange} className="form-control" placeholder="CITY" minLength="3" required />
      </div>
      <div className="col-md-6">
        <label className="text-muted small text-uppercase tracking-widest mb-2">State</label>
        <input type="text" name="state" value={shippingData.state} onChange={handleInputChange} className="form-control" placeholder="STATE" minLength="3" required />
      </div>
      <div className="col-md-6">
        <label className="text-muted small text-uppercase tracking-widest mb-2">Pincode</label>
        <input type="text" name="pincode" value={shippingData.pincode} onChange={handleInputChange} className="form-control" placeholder="PINCODE" pattern="[0-9]{6}" title="Please enter a valid 6-digit pincode" required />
      </div>
      <div className="col-md-6">
        <label className="text-muted small text-uppercase tracking-widest mb-2">Phone</label>
        <input type="tel" name="phone" value={shippingData.phone} onChange={handleInputChange} className="form-control" placeholder="PHONE NUMBER" pattern="[0-9]{10}" title="Please enter a valid 10-digit phone number" required />
      </div>
      <div className="col-12 mt-5">
        <div className="row g-3">
          <div className="col-md-6">
            <button type="button" onClick={prevStep} className="btn btn-outline-dark w-100 py-3 text-uppercase tracking-widest">Back</button>
          </div>
          <div className="col-md-6">
            <button type="submit" className="btn btn-dark w-100 py-3 text-uppercase tracking-widest">Continue to Payment</button>
          </div>
        </div>
      </div>
    </form>
  </div>
);

const PaymentStep = ({ shippingData, total, discount, couponCode, prevStep }) => (
  <div className="bg-white">
    <h5 className="text-uppercase fw-bold mb-4 tracking-widest">Payment Selection</h5>
    <div className="mb-4 bg-light p-3 border">
      <h6 className="text-uppercase fw-bold small mb-3 tracking-widest">Delivering to:</h6>
      <p className="small text-muted mb-1">{shippingData.fullName}</p>
      <p className="small text-muted mb-0">{shippingData.address}, {shippingData.city}, {shippingData.state} - {shippingData.pincode}</p>
    </div>
    <Elements stripe={stripePromise}>
      <CheckoutForm
        total={total}
        discountAmount={discount}
        couponCode={couponCode}
        shippingDetails={shippingData}
        onBack={prevStep}
      />
    </Elements>
  </div>
);

// --- Main Checkout Component ---

const Checkout = () => {
  const { cart, discount, couponCode } = useContext(CartContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingData, setShippingData] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: ""
  });

  const subtotal = cart.reduce((acc, item) => acc + item.qty * item.price, 0);
  const total = Math.max(0, Number(subtotal) - Number(discount));

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setShippingData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);

  if (cart.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h3 className="text-uppercase tracking-widest py-5">Your cart is empty</h3>
        <NavLink to="/products" className="btn btn-dark px-5">Back to Shop</NavLink>
      </div>
    );
  }

  return (
    <div className="bg-white min-vh-100 py-5 section-padding border-top">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            <StepIndicator currentStep={currentStep} />
            <div className="card border shadow-sm p-2">
              <div className="card-body p-md-5">
                {currentStep === 1 && (
                  <ProductSummary
                    cart={cart}
                    subtotal={subtotal}
                    discount={discount}
                    total={total}
                    nextStep={nextStep}
                  />
                )}
                {currentStep === 2 && (
                  <ShippingDetails
                    shippingData={shippingData}
                    handleInputChange={handleInputChange}
                    nextStep={nextStep}
                    prevStep={prevStep}
                  />
                )}
                {currentStep === 3 && (
                  <PaymentStep
                    shippingData={shippingData}
                    total={total}
                    discount={discount}
                    couponCode={couponCode}
                    prevStep={prevStep}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
