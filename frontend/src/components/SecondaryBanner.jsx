import React from "react";
import { NavLink } from "react-router-dom";

const SecondaryBanner = () => {
  return (
    <div className="position-relative overflow-hidden bg-dark" style={{ height: '400px' }}>
      <img 
        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
        className="w-100 h-100 object-fit-cover opacity-50"
        alt="Summer Collection"
      />
      <div className="position-absolute top-50 start-50 translate-middle text-center text-white w-100">
        <h3 className="text-uppercase ls-2 mb-2 small fw-bold text-primary">Limited Edition</h3>
        <h2 className="display-4 fw-bold mb-4 text-white">Summer Collection 2026</h2>
        <NavLink to="/products" className="btn btn-primary btn-lg px-5 py-3 rounded-0 fw-bold">
            EXPLORE NOW
        </NavLink>
      </div>
    </div>
  );
};

export default SecondaryBanner;
