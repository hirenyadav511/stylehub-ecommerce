import React from "react";
import { NavLink } from "react-router-dom";

const OfferBanner = () => {
  return (
    <section className="bg-dark py-5">
      <div className="container text-center py-4">
        <h6 className="text-white-50 text-uppercase tracking-widest mb-3">Limited Time Offer</h6>
        <h2 className="display-4 text-white fw-bold mb-4 tracking-tighter">FLAT 20% OFF ON NEW COLLECTION</h2>
        <p className="text-white-50 mb-5 text-uppercase tracking-wider">Use Code: FASHION20 at checkout</p>
        <NavLink to="/products" className="btn btn-outline-light btn-lg px-5 py-3">
            SHOP THE COLLECTION
        </NavLink>
      </div>
    </section>
  );
};

export default OfferBanner;
