import React from "react";
import { NavLink } from "react-router-dom";

const About = () => {
  return (
    <div className="bg-white min-vh-100 pb-5 section-padding">
      <div className="container">
        {/* Header Section */}
        <div className="text-center mb-5 pb-5">
          <h6 className="text-muted text-uppercase tracking-widest mb-2">Our Story</h6>
          <h2 className="text-uppercase fw-bold display-4">About La Collection</h2>
          <div className="mx-auto bg-dark" style={{ width: '60px', height: '2px' }}></div>
        </div>

        {/* Core Content Section */}
        <div className="row align-items-center mb-5 py-5 g-5">
          <div className="col-md-6 order-md-2">
             <div className="ps-md-5">
                <h2 className="text-uppercase fw-bold mb-4 tracking-tighter">Empowering Your Wardrobe</h2>
                <p className="text-muted mb-4 lead">
                  Welcome to <strong>La Collection</strong>, where fashion meets accessibility. 
                  We believe that looking good shouldn't come with a premium price tag.
                </p>
                <p className="text-muted mb-5">
                  Our curated collections are designed to reflect the dynamic lifestyle of the modern individual.
                  From high-quality essentials to premium statement pieces, we source only the best materials 
                  to ensure comfort and durability in every stitch.
                </p>
                <NavLink to="/products" className="btn btn-dark px-5">SHOP COLLECTION</NavLink>
             </div>
          </div>
          <div className="col-md-6 order-md-1">
             <div className="bg-light overflow-hidden" style={{ aspectRatio: '4/5' }}>
                <img 
                  src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop" 
                  alt="Fashion Studio" 
                  className="w-100 h-100 object-fit-cover"
                />
             </div>
          </div>
        </div>

        {/* Philosophy Section */}
        <div className="row g-5 py-5 text-center border-top">
          {[
            { title: "Design", text: "Minimalist aesthetics paired with timeless silhouettes." },
            { title: "Quality", text: "Premium fabrics sourced from sustainable partners." },
            { title: "Craft", text: "Meticulous attention to detail in every garment." },
            { title: "Ethos", text: "Ethical production and fair trade practices." }
          ].map((feature, index) => (
            <div key={index} className="col-md-3">
              <div className="p-3">
                <h6 className="text-uppercase tracking-widest fw-bold mb-3">{feature.title}</h6>
                <p className="text-muted small mb-0">{feature.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Secondary Content Section */}
        <div className="row align-items-center mt-5 py-5 g-5 border-top">
          <div className="col-md-6">
             <div className="pe-md-5">
                <h2 className="text-uppercase fw-bold mb-4 tracking-tighter">Sustainability First</h2>
                <p className="text-muted mb-4">
                  We are committed to ethical sourcing and reducing our environmental footprint one garment at a time.
                  Our goal is to create fashion that lasts, moving away from the fast-fashion cycle towards a more
                  sustainable and conscious future.
                </p>
                <p className="text-muted small text-uppercase tracking-widest">Read our 2026 impact report</p>
             </div>
          </div>
          <div className="col-md-6">
             <div className="bg-light overflow-hidden" style={{ aspectRatio: '16/9' }}>
                <img 
                  src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1974&auto=format&fit=crop" 
                  alt="Sustainable Fashion" 
                  className="w-100 h-100 object-fit-cover"
                />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
