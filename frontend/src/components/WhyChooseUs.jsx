import React from "react";

const WhyChooseUs = () => {
  const points = [
    { title: "Premium Quality", text: "Premium materials sourced globally.", icon: "fa-certificate" },
    { title: "Affordable Prices", text: "Luxury styles at honest prices.", icon: "fa-tags" },
    { title: "Fast Delivery", text: "Shipments that arrive on schedule.", icon: "fa-truck" },
    { title: "Easy Returns", text: "No-questions-asked 30-day returns.", icon: "fa-undo" }
  ];

  return (
    <div className="py-5 bg-light">
      <div className="container py-4">
        <div className="row g-4 justify-content-center">
          {points.map((point, index) => (
            <div key={index} className="col-md-3">
              <div className="text-center p-3">
                <div className="bg-white shadow-sm rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '70px', height: '70px' }}>
                   <i className={`fa ${point.icon} text-primary fs-3`}></i>
                </div>
                <h5 className="fw-bold">{point.title}</h5>
                <p className="text-muted small px-3">{point.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
