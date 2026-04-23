import React from "react";
import { useNavigate } from "react-router-dom";

const CategoriesSection = () => {
  const navigate = useNavigate();

  const categories = [
    {
      title: "T-Shirts",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1780&auto=format&fit=crop",
      link: "/products"
    },
    {
      title: "Shirts",
      image: "https://images.unsplash.com/photo-1596755094514-f87034a3121d?q=80&w=1888&auto=format&fit=crop",
      link: "/products"
    },
    {
      title: "Jeans",
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1926&auto=format&fit=crop",
      link: "/products"
    },
    {
      title: "Jackets",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1935&auto=format&fit=crop",
      link: "/products"
    }
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="text-uppercase tracking-widest">Shop By Category</h2>
          <div className="mx-auto bg-dark" style={{ width: '40px', height: '2px' }}></div>
        </div>
        <div className="row g-4">
          {categories.map((cat, index) => (
            <div key={index} className="col-6 col-md-3">
              <div
                className="category-card position-relative overflow-hidden cursor-pointer"
                style={{ height: '320px', borderRadius: '8px' }}
                onClick={() => navigate(cat.link)}
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-100 h-100 object-fit-cover transition"
                  style={{ transition: 'transform 0.5s ease' }}
                />
                <div className="position-absolute bottom-0 start-0 w-100 p-4 bg-gradient-to-t from-black/50 to-transparent">
                  <h6 className="text-white text-uppercase mb-0 tracking-wider fw-bold">{cat.title}</h6>
                  <small className="text-white-50 text-uppercase" style={{ fontSize: '0.7rem' }}>Explore Collection</small>
                </div>
                <div className="hover-overlay position-absolute top-0 start-0 w-100 h-100 bg-black opacity-0 transition hover:opacity-10"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .category-card:hover img {
          transform: scale(1.05);
        }
        .category-card .hover-overlay {
          transition: opacity 0.3s ease;
        }
        .category-card:hover .hover-overlay {
          opacity: 0.1;
        }
      `}</style>
    </section>
  );
};

export default CategoriesSection;
