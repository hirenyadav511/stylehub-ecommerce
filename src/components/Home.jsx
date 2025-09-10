import React from "react";
import Products from "./Products";

const Home = () => {
  return (
    <div className="hero">
      <div className="card bg-dark text-white border-0">
        <img
          src="https://static.vecteezy.com/system/resources/previews/027/215/100/non_2x/young-man-with-curly-hair-shopping-carrying-bags-on-neutral-background-new-collection-or-sales-mockup-free-photo.jpg"
          // src="../assests/home.jpg"
          className="card-img"
          alt="background"
          height="550px"
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
      <Products />
    </div>
  );
};

export default Home;
