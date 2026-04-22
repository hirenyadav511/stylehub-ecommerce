import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { CartContext } from "../context/CartContext";

import { SignedIn, SignedOut, SignOutButton, UserButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const { cart } = useContext(CartContext);
  const { user } = useUser();
  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-white navbar-light py-3 shadow-sm fixed-top shadow-sm" style={{ zIndex: 1050 }}>
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
                <NavLink className="nav-link active" aria-current="page" to="/">
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
            <div className="buttons d-flex align-items-center">
              <SignedOut>
                <NavLink to="/login" className="btn btn-outline-dark">
                  <i className="fa fa-sign-in me-1"></i> Login
                </NavLink>
                <NavLink to="/register" className="btn btn-outline-dark ms-2">
                  <i className="fa fa-user-plus me-1"></i> Register
                </NavLink>
              </SignedOut>
              <SignedIn>
                <NavLink to="/wishlist" className="btn btn-outline-dark ms-2">
                  <i className="fa fa-heart me-1"></i> Wishlist
                </NavLink>
                <NavLink to="/orders" className="btn btn-outline-dark ms-2">
                  <i className="fa fa-list me-1"></i> My Orders
                </NavLink>
                {user?.publicMetadata?.role === 'admin' && (
                  <NavLink to="/admin" className="btn btn-outline-dark ms-2">
                    <i className="fa fa-cog me-1"></i> Admin
                  </NavLink>
                )}
                <div className="ms-2">
                  <SignOutButton>
                    <button className="btn btn-outline-dark">
                      <i className="fa fa-sign-out me-1"></i> Logout
                    </button>
                  </SignOutButton>
                </div>
              </SignedIn>
              <NavLink to="/cart" className="btn btn-outline-dark ms-2 text-nowrap">
                <i className="fa fa-shopping-cart me-1"></i> Cart ({cart.length})
              </NavLink>
              <SignedIn>
                <div className="ms-3">
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
