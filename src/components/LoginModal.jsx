/** @format */

import { useState } from "react";

const USERNAME = import.meta.env.VITE_MEMORIES_USERNAME;
const PASSWORD = import.meta.env.VITE_MEMORIES_PASSWORD;

export function LoginModal({ onSuccess }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (user === USERNAME && pass === PASSWORD) {
      onSuccess();
    } else {
      setError("Login yoki parol noto'g'ri");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div style={{ width: "300px" }}>
      <h2 style={{ marginBottom: "20px", textAlign: "center" }}>Kirish</h2>
      <input
        type="text"
        placeholder="Login"
        value={user}
        onChange={(e) => setUser(e.target.value)}
        onKeyPress={handleKeyPress}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          border: "1px solid #ddd",
          borderRadius: "4px",
          boxSizing: "border-box",
        }}
      />
      <input
        type="password"
        placeholder="Parol"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
        onKeyPress={handleKeyPress}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "15px",
          border: "1px solid #ddd",
          borderRadius: "4px",
          boxSizing: "border-box",
        }}
      />
      {error && (
        <p style={{ color: "red", marginBottom: "15px", textAlign: "center" }}>
          {error}
        </p>
      )}
      <button
        onClick={handleLogin}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "16px",
        }}>
        Kirish
      </button>
    </div>
  );
}
