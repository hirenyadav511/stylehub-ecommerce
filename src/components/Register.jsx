import React from "react";
import { SignUp } from "@clerk/clerk-react";

const Register = () => {
  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <SignUp routing="path" path="/register" signInUrl="/login" afterSignUpUrl="/" />
    </div>
  );
};

export default Register;
