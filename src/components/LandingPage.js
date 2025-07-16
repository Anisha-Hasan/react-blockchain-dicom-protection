import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="container">
      <h1>Welcome to Blockchain DICOM Protection</h1>
      <Link to="/patient-login">
        <button>Login as Patient</button>
      </Link>
      <Link to="/staff-login">
        <button>Login as Staff</button>
      </Link>
    </div>
  );
}

export default LandingPage;
