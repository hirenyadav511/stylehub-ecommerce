import React from "react";
import Products from "./Products";
import CategoriesSection from "./CategoriesSection";
import WhyChooseUs from "./WhyChooseUs";
import OfferBanner from "./OfferBanner";
import SecondaryBanner from "./SecondaryBanner";
import Newsletter from "./Newsletter";

const Home = () => {
  return (
    <div className="home-container">
      {/* Existing Hero Section (Unchanged) */}
      <div className="hero">
        <div className="card bg-dark text-white border-0 rounded-0">
          <img
            src="https://static.vecteezy.com/system/resources/previews/027/215/100/non_2x/young-man-with-curly-hair-shopping-carrying-bags-on-neutral-background-new-collection-or-sales-mockup-free-photo.jpg"
            className="card-img"
            alt="background"
            height="550px"
            style={{ objectFit: 'cover' }}
          />
          <div className="card-img-overlay d-flex flex-column justify-content-center">
            <div className="container">
              <h5 className="card-title display-3 fw-bolder md-0">
                NEW SEASOM ARRIVALS
              </h5>
              <p className="card-text lead fs-2">CHECK OUT ALL THE TRENDS</p>
            </div>
          </div>
        </div>
      </div>

      {/* New Sections Below Hero */}
      <div className="bg-light py-5">
         <CategoriesSection />
      </div>

      <section className="py-5 bg-white">
        <div className="text-center mt-4">
           <h2 className="fw-bold h1">Trending Now</h2>
           <p className="text-muted">Hand-picked seasonal favorites for your wardrobe.</p>
        </div>
        <Products isFeatured={true} limit={6} hideHeader={true} />
      </section>

      <OfferBanner />

      <div className="bg-light py-5">
         <WhyChooseUs />
      </div>

      <SecondaryBanner />

      <section className="py-5 bg-white">
        <div className="container mt-5">
           <hr className="mb-5 opacity-10" />
           <div className="text-center mb-5">
              <h2 className="fw-bold h1">Our Full Collection</h2>
              <p className="text-muted">Everything you need to complete your look.</p>
           </div>
        </div>
        <Products />
      </section>

      <Newsletter />
    </div>
  );
};

export default Home;
