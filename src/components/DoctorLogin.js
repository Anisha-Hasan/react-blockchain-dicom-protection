import React, { useState } from 'react';
import './Form.css'; 
import { useNavigate } from 'react-router-dom';

function DoctorLogin() {
  const [doctorID, setDoctorID] = useState('');
  const [password, setPassword] = useState('');
  const [attempts, setAttempts] = useState(0);

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    // Fake correct credentials for testing
    const correctID = 'doc001';
    const correctPassword = 'admin123';

    if (doctorID === correctID && password === correctPassword) {
      navigate('/doctor-dashboard');
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 3) {
        alert('Too many failed attempts.');
      } else {
        alert(`Incorrect credentials. You have ${3 - newAttempts} tries left.`);
      }
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
        <button type="submit" className="btn btn-success">
          Login
        </button>
        </form>
      </div>
    </div>
  );
}

export default DoctorLogin;
