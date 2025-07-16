import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  return (
    <div className="hero-container">
  <div className="hero-content">
    <h1>Blockchain DICOM Protection System</h1>
    <p>Secure. Decentralized. Patient-Controlled Medical Image Access.</p>
    <div className="mt-4">
      <Link to="/patient-login">
        <button className="btn btn-primary btn-lg me-3">Login as Patient</button>
      </Link>
      <Link to="/staff-login">
        <button className="btn btn-success btn-lg">Login as Staff</button>
      </Link>
    </div>
  </div>

  <div className="hero-image">
    {/* Add your illustration, SVG or image here */}
    <img src="YOUR_IMAGE_PATH" alt="Illustration" />
  </div>
</div>
  );
}

export default LandingPage;
