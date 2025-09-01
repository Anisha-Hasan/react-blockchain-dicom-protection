import React, { useState } from "react";
import "./Form.css";
import { useNavigate } from "react-router-dom";

function PatientLogin() {
  const [patientID, setPatientID] = useState("");
  const [password, setPassword] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [errorMessage, setErrorMessage] = useState(""); // ✅ Error message in UI

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({patientID, password }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.role === "patient") {
          localStorage.setItem("patientID", patientID);
          navigate("/patient-dashboard"); // ✅ redirect silently
        } else {
          setErrorMessage("You are not authorized as a patient.");
        }
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (newAttempts >= 3) {
          setErrorMessage("Too many failed attempts. Please try again later.");
        } else {
          setErrorMessage(
            data.message || `Wrong ID or Password. You have ${3 - newAttempts} tries left.`
          );
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
        <h2 className="mb-4">Patient Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Patient ID / Mobile No.</label>
            <input
              type="text"
              className="form-control"
              value={patientID}
              onChange={(e) => setPatientID(e.target.value)}
              placeholder="Enter your Patient ID / Registered Mobile No."
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
          {errorMessage && <p className="text-danger">{errorMessage}</p>} {/* ✅ error below form */}
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default PatientLogin;
