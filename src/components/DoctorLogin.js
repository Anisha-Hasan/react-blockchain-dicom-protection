import React, { useState } from "react";
import "./Form.css";
import { useNavigate } from "react-router-dom";

function DoctorLogin() {
  const [doctorID, setDoctorID] = useState("");
  const [password, setPassword] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [errorMessage, setErrorMessage] = useState(""); // ✅ Error shown inside UI

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: doctorID, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Successful login → redirect silently
        if (data.role === "doctor") {
          navigate("/doctor-dashboard");
        } else {
          setErrorMessage("You are not authorized as a doctor.");
        }
      } else {
        // ❌ Wrong credentials → increase attempts and show error
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (newAttempts >= 3) {
          setErrorMessage("Too many failed attempts. Please try again later.");
        } else {
          setErrorMessage(data.message || `Incorrect credentials. You have ${3 - newAttempts} tries left.`);
        }
      }
    } catch (error) {
      console.error("❌ Login Error:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-hero">
      <div className="form-container">
        <h2 className="mb-4">Doctor Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Doctor ID</label>
            <input
              type="text"
              className="form-control"
              value={doctorID}
              onChange={(e) => setDoctorID(e.target.value)}
              placeholder="Enter your Doctor ID"
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          {errorMessage && <p className="text-danger">{errorMessage}</p>} {/* ✅ Error below form */}
          <button type="submit" className="btn btn-success">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default DoctorLogin;
