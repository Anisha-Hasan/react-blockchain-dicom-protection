import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="container text-center mt-5">
      <h1 className="mb-4">Blockchain DICOM Protection System</h1>
      <div className="d-flex justify-content-center gap-3">
        <Link to="/patient-login">
          <button className="btn btn-primary btn-lg">Login as Patient</button>
        </Link>
        <Link to="/staff-login">
          <button className="btn btn-success btn-lg">Login as Staff</button>
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;
