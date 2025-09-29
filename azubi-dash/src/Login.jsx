import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextInput from "./components/TextInput";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const history = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      console.log("Login attempt with", { username, password });

      const response = await fetch("http://localhost:3002/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: username, pass: password }),
      });

      console.log("Response:", response);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error data from server:", errorData);
        throw new Error(errorData.message || "Invalid credentials");
      }

      const { token } = await response.json();
      console.log("Login successful, received token:", token);

      document.cookie = `token=${token}; path=/`;
      history("/home");
    } catch (error) {
      console.error("Login error:", error);
      setError(
        "Failed to log in. Please check your credentials and try again."
      );
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2 className="login-title">Azubi-Dashboard</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin} className="login-form">
          {/* Username Input */}
          <TextInput
            placeholder="Benutzername"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
          />

          {/* Password Input */}
          <TextInput
            placeholder="Passwort"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />

          <button type="submit" className="login-button">
            Einloggen
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
