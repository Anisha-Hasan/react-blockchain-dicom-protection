import React, { useState } from 'react';
import ProfileSettings from './ProfileSettings';
import './Dashboard.css';

function PatientDashboard() {
  const [section, setSection] = useState('welcome'); // Start with welcome page

  const patientName = 'Mark';

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        {/* Clickable heading goes to Welcome */}
        <h2 onClick={() => setSection('welcome')} style={{ cursor: 'pointer' }}>
          MyHealth
        </h2>
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
        {section === 'welcome' && (
          <div>
            <h2>Welcome back, <span className="highlight">{patientName}!</span></h2>
            <p>Check your recent activity, view new access requests, and manage your DICOM files easily from here.</p>
          </div>
        )}

        {section === 'profile' && (
          <ProfileSettings name={patientName} uniqueId="P001" role="Patient" />
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
            <p>View and manage your medical images here. (Coming soon!)</p>
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
            <p>Learn more about this system and how to keep your data secure. (Coming soon!)</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default PatientDashboard;
