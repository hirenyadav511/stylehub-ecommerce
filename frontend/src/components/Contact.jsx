import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="bg-white min-vh-100 py-5 section-padding">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="text-center mb-5 pb-5">
              <h6 className="text-muted text-uppercase tracking-widest mb-2">Get In Touch</h6>
              <h2 className="text-uppercase fw-bold display-4">Contact Us</h2>
              <div className="mx-auto bg-dark" style={{ width: '60px', height: '2px' }}></div>
            </div>

            <div className="row g-5">
              {/* Contact Info */}
              <div className="col-md-5">
                <div className="pe-md-5">
                  <h4 className="text-uppercase fw-bold mb-4 tracking-tighter">Support & Inquiries</h4>
                  <p className="text-muted mb-5">We'd love to hear from you. Send us a message and we'll get back as soon as possible.</p>
                  
                  <div className="mb-4">
                    <h6 className="text-uppercase fw-bold mb-1 tracking-widest">Email</h6>
                    <p className="text-muted small">support@lacollection.com</p>
                  </div>

                  <div className="mb-4">
                    <h6 className="text-uppercase fw-bold mb-1 tracking-widest">Phone</h6>
                    <p className="text-muted small">+91 (123) 456-7890</p>
                  </div>

                  <div className="mb-4">
                    <h6 className="text-uppercase fw-bold mb-1 tracking-widest">Showroom</h6>
                    <p className="text-muted small">123 Fashion Street, Style Hub,<br />Mumbai, MH 400001</p>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="col-md-7 border-start-md ps-md-5">
                {submitted ? (
                  <div className="p-4 bg-light border text-center text-uppercase tracking-widest">
                    <i className="fa fa-check me-2"></i> Message Sent Successfully
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="row g-4">
                    <div className="col-12">
                      <label className="text-muted small text-uppercase tracking-widest mb-2 d-block">Full Name</label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-control" 
                        placeholder="ENTER YOUR NAME" 
                        required 
                      />
                    </div>
                    <div className="col-12">
                      <label className="text-muted small text-uppercase tracking-widest mb-2 d-block">Email Address</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-control" 
                        placeholder="ENTER YOUR EMAIL" 
                        required 
                      />
                    </div>
                    <div className="col-12">
                      <label className="text-muted small text-uppercase tracking-widest mb-2 d-block">Your Message</label>
                      <textarea 
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className="form-control" 
                        rows="6" 
                        placeholder="HOW CAN WE HELP YOU?" 
                        required
                      ></textarea>
                    </div>
                    <div className="col-12 mt-5">
                      <button type="submit" className="btn btn-dark w-100 py-4 text-uppercase tracking-widest">
                        SEND MESSAGE
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
