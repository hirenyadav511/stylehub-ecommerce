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
      {/* Existing Hero Section (Unchanged per instructions) */}
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
            <div className="container text-start">
              <h1 className="card-title display-2 fw-bold mb-2">
                NEW SEASON ARRIVALS
              </h1>
              <p className="card-text lead fs-4 fw-normal text-uppercase tracking-wider">Check out all the latest trends</p>
            </div>
          </div>
        </div>
      </div>

      <WhyChooseUs />

      <CategoriesSection />

      <section className="section-padding bg-white border-top">
        <div className="container">
          <div className="text-center mb-5">
            <h6 className="text-muted text-uppercase tracking-widest mb-2">Editor's Choice</h6>
            <h2 className="text-uppercase fw-bold display-5">Trending Now</h2>
            <div className="mx-auto bg-dark" style={{ width: '40px', height: '2px' }}></div>
          </div>
          <Products isFeatured={true} limit={4} hideHeader={true} />
        </div>
      </section>

      <OfferBanner />

      <section className="section-padding bg-white border-top border-bottom">
        <div className="container">
          <div className="text-center mb-5">
            <h6 className="text-muted text-uppercase tracking-widest mb-2">Our Essentials</h6>
            <h2 className="text-uppercase fw-bold display-5">Full Collection</h2>
            <div className="mx-auto bg-dark" style={{ width: '40px', height: '2px' }}></div>
          </div>
          <Products limit={8} hideHeader={true} />
        </div>
      </section>

      <SecondaryBanner />

      <Newsletter />
    </div>
  );
};

export default Home;
