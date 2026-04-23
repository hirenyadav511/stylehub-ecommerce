import React, { useState } from "react";

const Newsletter = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("");

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            setStatus("success");
            setEmail("");
            setTimeout(() => setStatus(""), 5000);
        }
    };

    return (
        <section className="section-padding bg-light border-top">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-6 text-center">
                        <h6 className="text-uppercase tracking-widest mb-3">Stay Connected</h6>
                        <h2 className="text-uppercase mb-4 fw-bold">Join Our Newsletter</h2>
                        <p className="text-muted mb-5">Subscribe to receive updates, access to exclusive deals, and more.</p>
                        
                        {status === "success" ? (
                            <div className="p-4 bg-white border border-dark text-dark text-uppercase tracking-widest" role="alert">
                                <i className="fa fa-check me-2"></i> Thank you for subscribing
                            </div>
                        ) : (
                            <form onSubmit={handleSubscribe} className="d-flex flex-column flex-md-row gap-0">
                                <input 
                                    type="email" 
                                    className="form-control px-4 flex-grow-1" 
                                    placeholder="ENTER YOUR EMAIL" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required 
                                    style={{ height: '60px', borderRight: 'none' }}
                                />
                                <button type="submit" className="btn btn-dark px-5" style={{ height: '60px' }}>
                                    SUBSCRIBE
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;
