import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function StaffLogin() {
  const [staffID, setStaffID] = useState('');
  const [password, setPassword] = useState('');
  const [attempts, setAttempts] = useState(0);

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    // Fake correct credentials for testing
    const correctID = 'staff001';
    const correctPassword = 'admin123';

    if (staffID === correctID && password === correctPassword) {
      navigate('/staff-dashboard');
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
    <div className="container mt-5">
      <h2 className="mb-4">Staff Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Staff ID</label>
          <input
            type="text"
            className="form-control"
            value={staffID}
            onChange={(e) => setStaffID(e.target.value)}
            placeholder="Enter your Staff ID"
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
  );
}

export default StaffLogin;
