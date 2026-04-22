import React from "react";
import { useNavigate } from "react-router-dom";

const CategoriesSection = () => {
  const navigate = useNavigate();
  
  const categories = [
    { title: "T-Shirts", icon: "fa-tshirt", color: "bg-danger" },
    { title: "Shirts", icon: "fa-user-tie", color: "bg-primary" },
    { title: "Jeans", icon: "fa-socks", color: "bg-success" },
    { title: "Hoodies", icon: "fa-vest", color: "bg-warning" }
  ];

  return (
    <div className="py-5 bg-white">
      <div className="container py-4">
        <div className="text-center mb-5">
           <h2 className="fw-bold h1">Shop By Categories</h2>
           <p className="text-muted">Find exactly what you're looking for in our specialized collections.</p>
        </div>
        <div className="row g-4">
          {categories.map((cat, index) => (
            <div key={index} className="col-6 col-md-3">
              <div 
                className="card border-0 shadow-sm rounded-4 text-center p-4 hover-lift pointer transition h-100"
                onClick={() => navigate(`/products`)}
              >
                <div className={`${cat.color} bg-opacity-10 p-4 rounded-circle mx-auto mb-3 text-white`} style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <i className={`fa ${cat.icon} fs-2`} style={{ color: cat.color.replace('bg-', '') }}></i>
                </div>
                <h5 className="fw-bold mb-0">{cat.title}</h5>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesSection;
