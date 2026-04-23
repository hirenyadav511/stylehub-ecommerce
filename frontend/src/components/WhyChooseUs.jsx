import React from "react";

const WhyChooseUs = () => {
  const points = [
    { title: "Premium Quality", text: "Global Sourcing", icon: "fa-certificate" },
    { title: "Luxury Styles", text: "Honest Prices", icon: "fa-tags" },
    { title: "Fast Delivery", text: "On Schedule", icon: "fa-truck" },
    { title: "Easy Returns", text: "30-Day Policy", icon: "fa-undo" }
  ];

  return (
    <section className="py-5 bg-white border-top border-bottom">
      <div className="container">
        <div className="row g-4 justify-content-center">
          {points.map((point, index) => (
            <div key={index} className="col-6 col-md-3">
              <div className="text-center">
                <div className="mb-2 text-dark">
                   <i className={`fa ${point.icon} fs-4`}></i>
                </div>
                <h6 className="text-uppercase tracking-wider fw-bold mb-1" style={{ fontSize: '0.8rem' }}>{point.title}</h6>
                <p className="text-muted text-uppercase mb-0" style={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}>{point.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
