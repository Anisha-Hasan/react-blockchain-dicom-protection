import React, { useState } from 'react';
import './Dashboard.css';

function PatientDashboard() {
  const [section, setSection] = useState('profile');

  const patientName = 'Mark';

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Patient Dashboard</h2>
        <ul>
          <li onClick={() => setSection('profile')}>Profile Settings</li>
          <li onClick={() => setSection('requests')}>Access Requests</li>
          <li onClick={() => setSection('dicoms')}>My DICOMs</li>
          <li onClick={() => setSection('log')}>Access Log</li>
          <li onClick={() => setSection('help')}>Help/About</li>
          <li onClick={() => alert('Logging out')} style={{ color: 'red' }}>Logout</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
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
      </main>
    </div>
  );
}

export default PatientDashboard;
