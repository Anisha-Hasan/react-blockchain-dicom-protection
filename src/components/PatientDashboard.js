import React, { useState } from 'react';

function PatientDashboard() {
  const [section, setSection] = useState('profile');

  // Dummy patient name for now
  const patientName = 'Mark';

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <nav className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse" style={{ height: '100vh' }}>
          <div className="position-sticky pt-3">
            <h4 className="text-center mb-4">Dashboard</h4>
            <ul className="nav flex-column">
              <li className="nav-item">
                <button className="nav-link btn btn-link text-start" onClick={() => setSection('profile')}>
                  Profile Settings
                </button>
              </li>
              <li className="nav-item">
                <button className="nav-link btn btn-link text-start" onClick={() => setSection('requests')}>
                  Access Requests
                </button>
              </li>
              <li className="nav-item">
                <button className="nav-link btn btn-link text-start" onClick={() => setSection('dicoms')}>
                  My DICOMs
                </button>
              </li>
              <li className="nav-item">
                <button className="nav-link btn btn-link text-start" onClick={() => setSection('log')}>
                  Access Log
                </button>
              </li>
              <li className="nav-item">
                <button className="nav-link btn btn-link text-start" onClick={() => setSection('help')}>
                  Help/About
                </button>
              </li>
              <li className="nav-item">
                <button className="nav-link btn btn-link text-start text-danger" onClick={() => alert('Logging out')}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <div className="pt-4">
            {section === 'profile' && (
              <div>
                <h2>Welcome back, {patientName}!</h2>
                <p>This is your profile section. (Coming soon!)</p>
              </div>
            )}
            {section === 'requests' && (
              <div>
                <h2>Access Requests</h2>
                <p>List of requests from doctors or staff. (Coming soon!)</p>
              </div>
            )}
            {section === 'dicoms' && (
              <div>
                <h2>My DICOMs</h2>
                <p>View your DICOM files here. (Coming soon!)</p>
              </div>
            )}
            {section === 'log' && (
              <div>
                <h2>Access Log</h2>
                <p>See who accessed your data and when. (Coming soon!)</p>
              </div>
            )}
            {section === 'help' && (
              <div>
                <h2>Help / About</h2>
                <p>Learn more about this system. (Coming soon!)</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default PatientDashboard;
