import React, { useState, useEffect, useRef } from 'react';
import ProfileSettings from './ProfileSettings';
import './Dashboard.css';

function PatientDashboard() {
  const [section, setSection] = useState('welcome');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sidebarRef = useRef(null);
  const patientName = 'Mark';

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.classList.contains('hamburger')
      ) {
        closeSidebar();
      }
    };

    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <div className={`dashboard-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Hamburger */}
      <div className="hamburger" onClick={toggleSidebar}>
        &#9776;
      </div>

      {/* Sidebar */}
      <aside ref={sidebarRef} className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <h2 onClick={() => { setSection('welcome'); closeSidebar(); }} style={{ cursor: 'pointer' }}>
          MyHealth
        </h2>
        <ul>
          <li onClick={() => { setSection('profile'); closeSidebar(); }}>Profile Settings</li>
          <li onClick={() => { setSection('requests'); closeSidebar(); }}>Access Requests</li>
          <li onClick={() => { setSection('dicoms'); closeSidebar(); }}>My DICOMs</li>
          <li onClick={() => { setSection('log'); closeSidebar(); }}>Access Log</li>
          <li onClick={() => { setSection('help'); closeSidebar(); }}>Help/About</li>
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
