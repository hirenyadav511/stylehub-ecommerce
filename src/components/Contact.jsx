import React from "react";

const Contact = () => {
  return (
    <div>
      <div className="container py-5">
        <h2>Contact Us</h2>
        <p>Email: info@lacollection.com</p>
        <p>Phone: +91-1234567890</p>
        <form>
          <input type="text" placeholder="Name" className="form-control mb-2" />
          <input
            type="email"
            placeholder="Email"
            className="form-control mb-2"
          />
          <textarea
            placeholder="Message"
            className="form-control mb-2"
          ></textarea>
          <button className="btn btn-outline-dark" type="submit">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
