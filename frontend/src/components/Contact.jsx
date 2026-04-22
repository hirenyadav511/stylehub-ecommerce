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
    // Simulate API call
    console.log("Form Submitted:", formData);
    setSubmitted(true);
    
    // Reset form after success
    setFormData({ name: "", email: "", message: "" });
    
    // Hide success message after 5 seconds
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8">
            <div className="bg-white p-5 rounded-4 shadow-sm border border-secondary border-opacity-10">
              <div className="text-center mb-5">
                <h2 className="display-6 fw-bold text-dark">Contact Us</h2>
                <p className="text-muted">We'd love to hear from you. Send us a message and we'll get back as soon as possible.</p>
                <hr className="bg-primary mx-auto" style={{ width: '50px', height: '3px', opacity: '1' }} />
              </div>

              <div className="row g-5">
                {/* Contact Info */}
                <div className="col-md-5">
                  <div className="h-100 d-flex flex-column justify-content-center">
                    <div className="d-flex align-items-center mb-4">
                      <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3 text-primary">
                        <i className="fa fa-envelope fs-5"></i>
                      </div>
                      <div>
                        <h6 className="mb-0 fw-bold">Email</h6>
                        <p className="text-muted small mb-0">support@emart-clothing.com</p>
                      </div>
                    </div>

                    <div className="d-flex align-items-center mb-4">
                      <div className="bg-success bg-opacity-10 p-3 rounded-circle me-3 text-success">
                        <i className="fa fa-phone fs-5"></i>
                      </div>
                      <div>
                        <h6 className="mb-0 fw-bold">Phone</h6>
                        <p className="text-muted small mb-0">+91 (123) 456-7890</p>
                      </div>
                    </div>

                    <div className="d-flex align-items-center">
                      <div className="bg-danger bg-opacity-10 p-3 rounded-circle me-3 text-danger">
                        <i className="fa fa-map-marker fs-5"></i>
                      </div>
                      <div>
                        <h6 className="mb-0 fw-bold">Office</h6>
                        <p className="text-muted small mb-0">123 Fashion Street, Style Hub,<br />Mumbai, MH 400001</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="col-md-7 border-start border-light ps-md-5">
                  {submitted ? (
                    <div className="alert alert-success border-0 bg-success bg-opacity-10 text-success p-4 rounded-4 d-flex align-items-center mb-0 fade show" role="alert">
                      <i className="fa fa-check-circle fs-3 me-3"></i>
                      <div>
                        <h6 className="alert-heading fw-bold mb-1">Message Sent!</h6>
                        <p className="small mb-0">Thank you for reaching out. We'll be in touch shortly.</p>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="row g-3">
                      <div className="col-12">
                        <label className="form-label text-muted small fw-bold uppercase ls-1">Full Name</label>
                        <input 
                          type="text" 
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="form-control bg-light border-0 p-3 rounded-3" 
                          placeholder="John Doe" 
                          required 
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label text-muted small fw-bold uppercase ls-1">Email Address</label>
                        <input 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="form-control bg-light border-0 p-3 rounded-3" 
                          placeholder="john@example.com" 
                          required 
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label text-muted small fw-bold uppercase ls-1">Your Message</label>
                        <textarea 
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          className="form-control bg-light border-0 p-3 rounded-3" 
                          rows="4" 
                          placeholder="How can we help you?" 
                          required
                        ></textarea>
                      </div>
                      <div className="col-12 mt-4">
                        <button type="submit" className="btn btn-dark w-100 py-3 rounded-3 fw-bold shadow-sm hover-lift transition">
                          Send Message <i className="fa fa-paper-plane ms-2 small"></i>
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

      <style dangerouslySetInnerHTML={{ __html: `
        .hover-lift:hover { transform: translateY(-3px); }
        .transition { transition: all 0.3s ease; }
        .ls-1 { letter-spacing: 1px; }
        .uppercase { text-transform: uppercase; }
      `}} />
    </div>
  );
};

export default Contact;
