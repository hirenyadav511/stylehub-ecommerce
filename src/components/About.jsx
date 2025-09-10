import React from "react";

const About = () => {
  return (
    <div className="container py-5">
      <h2 className="mb-4">About LA COLLECTION</h2>
      <p className="lead">
        LA COLLECTION is your trusted online store for the latest fashion,
        accessories, and electronics. We bring you a diverse selection of
        products sourced from the trusted Fake Store API, ensuring quality and
        variety.
      </p>

      <h3 className="mt-5 mb-3">Our Mission</h3>
      <p>
        Our mission is to provide authentic and trendy products at affordable
        prices, making style accessible for everyone. We focus on excellent
        customer service and an enjoyable shopping experience.
      </p>

      <h3 className="mt-5 mb-3">Product Selection</h3>
      <p>
        We curate our products from the{" "}
        <a
          href="https://fakestoreapi.com/products"
          target="_blank"
          rel="noopener noreferrer"
        >
          Fake Store API
        </a>
        , which offers a wide range of items including men's and women's
        clothing, jewelry, and electronics. This helps us keep our inventory
        fresh and up to date.
      </p>

      <h3 className="mt-5 mb-3">Our Values</h3>
      <ul className="list-group list-group-flush">
        <li className="list-group-item">Customer satisfaction above all</li>
        <li className="list-group-item">Quality and authenticity guaranteed</li>
        <li className="list-group-item">Transparent pricing and deals</li>
        <li className="list-group-item">Commitment to ethical sourcing</li>
      </ul>

      <h3 className="mt-5 mb-3">Contact and Support</h3>
      <p>
        Have questions or need assistance? Reach out to our support team via the
        contact page or email us at{" "}
        <a href="mailto:support@lacollection.com">support@lacollection.com</a>.
      </p>
    </div>
  );
};

export default About;
