import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "../../styles/Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const result = await response.json(); 

      if (response.ok) {
        if (result.role === "user") {
          navigate("/dashboard");
        } else if (result.role === "store_owner") {
          navigate("/store-owner-dashboard");
        } else if (result.role === "admin") {
          navigate("/admin-dashboard");
        }
      } else {
        setMessage(result.message); 
      }
    } catch (error) {
      setMessage("Error occurred during login.");
    }
  };

  return (
    <div className="auth-page">
      {/* Decorative background elements */}
      <div className="background-shape1"></div>
      <div className="background-shape2"></div>

      <div className="auth-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <br />
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <br />
          <button type="submit">Login</button>
        </form>
        <p>{message}</p>
        <p className="switch-link">
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
        <a href="/" className="home-link">Back to Homepage</a> {/* Added link to go back to Homepage */}
      </div>
    </div>
  );
};

export default Login;
