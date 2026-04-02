import React from "react";
import { SignIn } from "@clerk/clerk-react";

const Login = () => {
  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <SignIn routing="path" path="/login" signUpUrl="/register" afterSignInUrl="/" />
    </div>
  );
};

export default Login;
