import React from "react";
import { NavLink } from "react-router-dom";

const SecondaryBanner = () => {
  return (
    <section className="section-padding py-0">
      <div className="container">
        <div className="position-relative overflow-hidden" style={{ height: '450px', borderRadius: '8px' }}>
          <img 
            src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=2070&auto=format&fit=crop"
            className="w-100 h-100 object-fit-cover"
            alt="Collection"
          />
          <div className="position-absolute top-0 start-0 w-100 h-100 bg-black opacity-25"></div>
          <div className="position-absolute top-50 start-50 translate-middle text-center text-white w-100 px-4">
            <h6 className="text-uppercase tracking-widest mb-3 fw-bold small">Curated Selection</h6>
            <h2 className="display-4 fw-bold mb-4 tracking-tighter text-uppercase">The Autumn Edit</h2>
            <div className="d-flex justify-content-center gap-3">
                <NavLink to="/products" className="btn btn-light px-4">
                    FOR MEN
                </NavLink>
                <NavLink to="/products" className="btn btn-outline-light px-4">
                    FOR WOMEN
                </NavLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecondaryBanner;
