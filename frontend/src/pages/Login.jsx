import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import logo from "../assets/listify-logo.png";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    password: "",
    server: "",
  });

  const handleChange = e => {
    const { id, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [id]: value,
    }));

    setErrors(prev => ({
      ...prev,
      [id]: "",
      server: "",
    }));
  };

  const handleLogin = async e => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(prev => ({
        ...prev,
        ...newErrors,
      }));
      return;
    }

    try {
      setErrors({
        username: "",
        password: "",
        server: "",
      });

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();
      console.log("login response:", data);
      console.log("username:", data.user?.username);

      if (!response.ok) {
        setErrors(prev => ({
          ...prev,
          server: data.message || "Login failed",
        }));
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.user.username);
      window.location.href = "/dashboard";
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        server: "Server error. Please try again.",
      }));
    }
  };

  return (
    <div className="login-page">
      <div className="login-phone-frame">
        <div className="login-content">
          <div className="brand-wrap">
            <img src={logo} alt="Listify logo" className="brand-logo" />
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="username"
                value={formData.username}
                onChange={handleChange}
                className={errors.username ? "input-error" : ""}
              />
              {errors.username && (
                <p className="error-label">{errors.username}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "input-error" : ""}
              />
              {errors.password && (
                <p className="error-label">{errors.password}</p>
              )}
            </div>

            {errors.server && (
              <p className="error-label server-error">{errors.server}</p>
            )}

            <button type="submit" className="login-button">
              Login
            </button>
          </form>

          <p className="signup-text">
            Don't have an account?{" "}
            <Link to="/register" className="signup-link">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
