import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { CartContext } from "../context/CartContext";

import { SignedIn, SignedOut, SignOutButton, UserButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const { cart } = useContext(CartContext);
  const { user } = useUser();
  return (
    <div>
      <nav className="navbar navbar-expand-lg fixed-top" style={{ zIndex: 1050 }}>
        <div className="container">
          <NavLink className="navbar-brand fw-bold fs-4" to="/">
            LA COLLECTION
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link" aria-current="page" to="/">
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/products">
                  Products
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/about">
                  About
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/contact">
                  Contact
                </NavLink>
              </li>
            </ul>
            <div className="buttons d-flex align-items-center gap-2 ms-lg-3">
              <SignedOut>
                <NavLink to="/login" className="btn btn-outline-dark">
                  <i className="fa fa-sign-in me-1"></i> Login
                </NavLink>
                <NavLink to="/register" className="btn btn-dark">
                  <i className="fa fa-user-plus me-1"></i> Register
                </NavLink>
              </SignedOut>
              <SignedIn>
                <NavLink to="/wishlist" className="btn btn-outline-dark p-2 nav-icon-btn" title="Wishlist">
                  <i className="fa fa-heart"></i>
                  <span className="btn-text">Wishlist</span>
                </NavLink>
                <NavLink to="/orders" className="btn btn-outline-dark p-2 nav-icon-btn" title="My Orders">
                  <i className="fa fa-list"></i>
                  <span className="btn-text">Orders</span>
                </NavLink>
                {user?.publicMetadata?.role === 'admin' && (
                  <NavLink to="/admin" className="btn btn-outline-dark p-2 nav-icon-btn" title="Admin">
                    <i className="fa fa-cog"></i>
                    <span className="btn-text">Admin</span>
                  </NavLink>
                )}
                <div className="ms-1">
                  <SignOutButton>
                    <button className="btn btn-outline-dark p-2 nav-icon-btn" title="Logout">
                      <i className="fa fa-sign-out"></i>
                      <span className="btn-text">Logout</span>
                    </button>
                  </SignOutButton>
                </div>
              </SignedIn>
              <NavLink to="/cart" className="btn btn-dark ms-1 nav-icon-btn">
                <i className="fa fa-shopping-cart me-1"></i> 
                <span className="btn-text">Cart</span> ({cart.length})
              </NavLink>
              <SignedIn>
                <div className="ms-2">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
