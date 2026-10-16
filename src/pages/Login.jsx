
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "./Login.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const success = login(email, password);

    if (success) {
      navigate("/", { replace: true });
    } else {
      setError("Invalid email or password.");
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-logo">D</div>

        <h1>Welcome back</h1>
        <p className="login-description">
          Sign in to access your dashboard.
        </p>

        <label htmlFor="email">Email address</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setError("");
          }}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setError("");
          }}
          required
        />

        {error && <p className="login-error">{error}</p>}

        <button type="submit">Sign in</button>

        <p className="demo-hint">
          Demo: admin@example.com / admin123
        </p>
      </form>
    </div>
  );
}
