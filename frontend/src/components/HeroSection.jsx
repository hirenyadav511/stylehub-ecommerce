import React from "react";
import { NavLink } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="bg-dark text-white py-5 mb-0 overflow-hidden position-relative">
      <div className="position-absolute top-50 start-50 translate-middle opacity-10" style={{ pointerEvents: 'none' }}>
         <i className="fa fa-shopping-bag" style={{ fontSize: '30rem' }}></i>
      </div>

      <div className="container py-5 position-relative">
        <div className="row justify-content-center text-center py-5">
          <div className="col-lg-8">
            <h6 className="text-primary text-uppercase fw-bold ls-1 mb-3">Spring / Summer Collection 2026</h6>
            <h1 className="display-2 fw-bold mb-4 tracking-tight">LATEST FASHION COLLECTION</h1>
            <p className="lead text-white-50 mb-5 px-lg-5">
                Discover the perfect blend of comfort and style with our trend-forward apparel. 
                Premium quality fabrics designed for the modern individual.
            </p>
            <div className="d-flex justify-content-center gap-3">
               <NavLink to="/products" className="btn btn-primary btn-lg px-5 py-3 rounded-pill fw-bold shadow">
                  Shop Men
               </NavLink>
               <NavLink to="/products" className="btn btn-outline-light btn-lg px-5 py-3 rounded-pill fw-bold">
                  Shop Women
               </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
