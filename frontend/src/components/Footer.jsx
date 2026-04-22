import React from "react";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-auto">
      <div className="container text-center text-md-start">
        <div className="row text-center text-md-start">
          {/* Brand & Tagline */}
          <div className="col-md-4 col-lg-4 col-xl-4 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 fw-bold text-primary ls-1">E-MART Fashion</h5>
            <p className="small text-white-50">
              Style that defines you. We provide high-quality clothing for the modern individual, 
              focusing on quality, sustainability, and affordability.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
            <h6 className="text-uppercase mb-4 fw-bold">Quick Links</h6>
            <p><NavLink to="/" className="text-white-50 text-decoration-none small hover-link">Home</NavLink></p>
            <p><NavLink to="/products" className="text-white-50 text-decoration-none small hover-link">Products</NavLink></p>
            <p><NavLink to="/about" className="text-white-50 text-decoration-none small hover-link">About Us</NavLink></p>
            <p><NavLink to="/contact" className="text-white-50 text-decoration-none small hover-link">Contact</NavLink></p>
          </div>

          {/* Contact Details */}
          <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
            <h6 className="text-uppercase mb-4 fw-bold">Contact</h6>
            <p className="small text-white-50"><i className="fa fa-home me-2"></i> Mumbai, MH 400001, IN</p>
            <p className="small text-white-50"><i className="fa fa-envelope me-2"></i> support@emart.com</p>
            <p className="small text-white-50"><i className="fa fa-phone me-2"></i> +91 123 456 7890</p>
          </div>

          {/* Social Icons */}
          <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
             <h6 className="text-uppercase mb-4 fw-bold">Follow Us</h6>
             <div className="d-flex justify-content-center justify-content-md-start gap-3">
                <a href="#!" className="text-white fs-5 border border-white-50 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px' }}>
                   <i className="fa fa-instagram"></i>
                </a>
                <a href="#!" className="text-white fs-5 border border-white-50 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px' }}>
                   <i className="fa fa-facebook"></i>
                </a>
                <a href="#!" className="text-white fs-5 border border-white-50 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px' }}>
                   <i className="fa fa-twitter"></i>
                </a>
             </div>
          </div>
        </div>

        <hr className="mb-4 mt-5 bg-white-50" />

        <div className="row align-items-center">
          <div className="col-md-12 text-center">
            <p className="small text-white-50">
              © 2026 <strong className="text-white">E-MART</strong>. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .hover-link:hover {
          color: white !important;
          padding-left: 5px;
          transition: all 0.3s ease;
        }
        .ls-1 {
          letter-spacing: 1px;
        }
      `}} />
    </footer>
  );
};

export default Footer;
