import React, { useState } from 'react';
import './Form.css'; 
import { useNavigate } from 'react-router-dom';

function PatientLogin() {
  const [patientID, setPatientID] = useState('');
  const [password, setPassword] = useState('');
  const [attempts, setAttempts] = useState(0);

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault(); // stops page from reloading

    // For now: fake correct ID & password
    const correctID = '12345';
    const correctPassword = 'pass123';

    if (patientID === correctID && password === correctPassword) {
      navigate('/patient-dashboard'); // sends user to dashboard
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 3) {
        alert('Too many failed attempts.');
      } else {
        alert(`Wrong ID or Password. You have ${3 - newAttempts} tries left.`);
      }
    }
  };

  return (
    <div className="form-container">
      <h2 className="mb-4">Patient Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Patient ID</label>
          <input
            type="text"
            className="form-control"
            value={patientID}
            onChange={(e) => setPatientID(e.target.value)}
            placeholder="Enter your Patient ID"
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
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
}

export default PatientLogin;
