import React from "react";
import { useNavigate } from "react-router-dom";

import tshirtImg from "../assests/tshirt.jpg";
import shirtImg from "../assests/shirt.jpg";
import jeansImg from "../assests/jeans.jpg";
import jacketImg from "../assests/jacket.jpg";

const CategoriesSection = () => {
  const navigate = useNavigate();

const categories = [
  {
    title: "T-Shirts",
    image: tshirtImg,
    link: "/products"
  },
  {
    title: "Shirts",
    image: shirtImg,
    link: "/products"
  },
  {
    title: "Jeans",
    image: jeansImg,
    link: "/products"
  },
  {
    title: "Jackets",
    image: jacketImg,
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
            <div key={index} className="col-12 col-sm-6 col-md-3">
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
