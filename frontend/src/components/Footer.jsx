import React from "react";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-top py-5 mt-auto">
      <div className="container py-4">
        <div className="row g-4">
          {/* Brand & Tagline */}
          <div className="col-md-4">
            <h5 className="text-uppercase fw-bold tracking-widest mb-4">La Collection</h5>
            <p className="text-muted small pe-md-5">
              Premium apparel designed for the modern individual. We focus on quality, 
              sustainability, and timeless style. Elevate your wardrobe with essentials 
              that define you.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-2">
            <h6 className="text-uppercase fw-bold small tracking-widest mb-4">Shop</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><NavLink to="/products" className="text-muted small text-uppercase tracking-tighter">All Products</NavLink></li>
              <li className="mb-2"><NavLink to="/products" className="text-muted small text-uppercase tracking-tighter">New Arrivals</NavLink></li>
              <li className="mb-2"><NavLink to="/products" className="text-muted small text-uppercase tracking-tighter">Featured</NavLink></li>
            </ul>
          </div>

          <div className="col-md-2">
            <h6 className="text-uppercase fw-bold small tracking-widest mb-4">Support</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><NavLink to="/about" className="text-muted small text-uppercase tracking-tighter">About Us</NavLink></li>
              <li className="mb-2"><NavLink to="/contact" className="text-muted small text-uppercase tracking-tighter">Contact</NavLink></li>
              <li className="mb-2"><NavLink to="/orders" className="text-muted small text-uppercase tracking-tighter">Orders</NavLink></li>
            </ul>
          </div>

          {/* Social Icons */}
          <div className="col-md-4 text-md-end">
            <h6 className="text-uppercase fw-bold small tracking-widest mb-4">Connect With Us</h6>
            <div className="d-flex justify-content-md-end gap-4 mb-4">
              <a href="#!" className="text-dark small"><i className="fa fa-instagram"></i></a>
              <a href="#!" className="text-dark small"><i className="fa fa-facebook"></i></a>
              <a href="#!" className="text-dark small"><i className="fa fa-pinterest"></i></a>
              <a href="#!" className="text-dark small"><i className="fa fa-twitter"></i></a>
            </div>
            <p className="text-muted small text-uppercase tracking-widest">© 2026 La Collection</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
