import React from "react";
import { NavLink } from "react-router-dom";

const OfferBanner = () => {
  return (
    <div className="bg-primary py-5 mb-0 shadow-inner">
      <div className="container text-center text-white py-2">
        <h2 className="fw-bold mb-3 ls-1 text-white">🔥 FLAT 20% OFF ON NEW COLLECTION</h2>
        <p className="lead mb-4 opacity-75 text-white">Upgrade your wardrobe with our premium essentials and seasonal favorites.</p>
        <NavLink to="/products" className="btn btn-light btn-lg px-5 py-3 rounded-pill fw-bold shadow-sm transition hover-lift">
            SHOP NOW <i className="fa fa-arrow-right ms-2 small"></i>
        </NavLink>
      </div>
    </div>
  );
};

export default OfferBanner;
