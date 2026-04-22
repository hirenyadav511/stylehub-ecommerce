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
        <div className="bg-light py-5">
            <div className="container py-4">
                <div className="row justify-content-center">
                    <div className="col-lg-7 text-center">
                        <div className="bg-white p-5 rounded-4 shadow-sm border border-secondary border-opacity-10">
                            <i className="fa fa-paper-plane text-primary fs-1 mb-4"></i>
                            <h2 className="fw-bold mb-3">Join Our Newsletter</h2>
                            <p className="text-muted mb-4 px-md-5">Subscribe to receive updates, access to exclusive deals, and more.</p>
                            
                            {status === "success" ? (
                                <div className="alert alert-success border-0 bg-success bg-opacity-10 text-success p-3 rounded-3" role="alert">
                                    <i className="fa fa-check-circle me-2"></i> Perfect! You've been subscribed.
                                </div>
                            ) : (
                                <form onSubmit={handleSubscribe} className="d-flex gap-2">
                                    <input 
                                        type="email" 
                                        className="form-control form-control-lg rounded-pill px-4 border-0 bg-light" 
                                        placeholder="Enter your email address" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required 
                                    />
                                    <button type="submit" className="btn btn-dark btn-lg px-4 rounded-pill fw-bold text-white">
                                        Subscribe
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Newsletter;
