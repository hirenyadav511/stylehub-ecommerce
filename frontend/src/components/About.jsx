import React from "react";
import { NavLink } from "react-router-dom";

const About = () => {
  return (
    <div className="bg-light min-vh-100 pb-5">
      {/* Header Section */}
      <div className="bg-dark text-white py-5 mb-5 shadow-sm">
        <div className="container text-center">
          <h1 className="display-4 fw-bold">About Us</h1>
          <p className="lead opacity-75">Your Style, Your Identity</p>
        </div>
      </div>

      <div className="container">
        {/* Core Content Section */}
        <div className="row align-items-center mb-5">
          <div className="col-md-6 order-md-2 mb-4 mb-md-0">
             <div className="bg-white p-4 rounded-4 shadow-sm border border-secondary border-opacity-10">
                <h2 className="fw-bold mb-4">Empowering Your Wardrobe</h2>
                <p className="text-secondary mb-3">
                  Welcome to <strong>E-MART Clothing</strong>, where fashion meets accessibility. 
                  We believe that looking good shouldn't come with a premium price tag. 
                  Our curated collections are designed to reflect the dynamic lifestyle of the modern individual.
                </p>
                <p className="text-secondary mb-4">
                  From high-quality <strong>T-Shirts</strong> and stylish <strong>Shirts</strong> to 
                  premium <strong>Jeans</strong>, <strong>Hoodies</strong>, and <strong>Jackets</strong>, 
                  we source only the best materials to ensure comfort and durability.
                </p>
                <NavLink to="/products" className="btn btn-dark px-4 py-2 rounded-pill">Shop Collection</NavLink>
             </div>
          </div>
          <div className="col-md-6 order-md-1">
             <div className="bg-secondary bg-opacity-10 rounded-4 overflow-hidden h-100 d-flex align-items-center justify-center p-5" style={{ minHeight: '300px' }}>
                <div className="text-center">
                   <i className="fa fa-shopping-bag text-dark opacity-10" style={{ fontSize: '10rem' }}></i>
                </div>
             </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="row g-4 mb-5 text-center">
          {[
            { icon: "fa-certificate", title: "Quality Products", text: "Premium fabrics sourced for lasting comfort." },
            { icon: "fa-tags", title: "Affordable Prices", text: "Look your best without breaking the bank." },
            { icon: "fa-truck", title: "Fast Delivery", text: "Get your favorites delivered to your door swiftly." },
            { icon: "fa-undo", title: "Easy Returns", text: "No-hassle 30-day return policy for peace of mind." }
          ].map((feature, index) => (
            <div key={index} className="col-md-3">
              <div className="bg-white p-4 rounded-4 shadow-sm h-100 border border-secondary border-opacity-10 hover-lift transition">
                <i className={`fa ${feature.icon} fs-2 text-primary mb-3`}></i>
                <h5 className="fw-bold">{feature.title}</h5>
                <p className="text-muted small mb-0">{feature.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Why Choose Us Section */}
        <div className="bg-white p-5 rounded-4 shadow-sm border border-secondary border-opacity-10 mb-5">
           <div className="row text-center mb-4">
              <div className="col-12">
                 <h2 className="fw-bold">Why Choose Us?</h2>
                 <hr className="bg-primary mx-auto" style={{ width: '50px', height: '3px', opacity: '1' }} />
              </div>
           </div>
           <div className="row g-4">
              <div className="col-md-4">
                 <div className="p-3">
                    <h6 className="fw-bold mb-2">Trend-Forward Designs</h6>
                    <p className="text-muted small">We stay ahead of the curve so you don't have to. Our designs are inspired by global street style.</p>
                 </div>
              </div>
              <div className="col-md-4 border-start border-end border-light">
                 <div className="p-3">
                    <h6 className="fw-bold mb-2">Sustainability</h6>
                    <p className="text-muted small">We are committed to ethical sourcing and reducing our environmental footprint one garment at a time.</p>
                 </div>
              </div>
              <div className="col-md-4">
                 <div className="p-3">
                    <h6 className="fw-bold mb-2">Customer First</h6>
                    <p className="text-muted small">Our dedicated support team is available 24/7 to ensure your shopping journey is perfect.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .hover-lift:hover {
          transform: translateY(-5px);
        }
        .transition {
          transition: all 0.3s ease;
        }
        .ls-1 {
          letter-spacing: 1px;
        }
      `}} />
    </div>
  );
};

export default About;
