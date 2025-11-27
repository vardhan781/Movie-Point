import React, { useContext, useState } from "react";
import { UserContext } from "../../Context/UserContext";
import "./Login.css";
import toast from "react-hot-toast";

const Login = () => {
  const { loginAdmin } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await loginAdmin(email, password);

    if (res.success) {
      toast.success("Login Successful!");
      window.location.href = "/admin/dashboard";
    } else {
      toast.error(res.message || "Invalid credentials");
    }

    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-head">
          <h1 className="logo">MoviePoint</h1>
          <p className="tagline">Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="Email address"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
