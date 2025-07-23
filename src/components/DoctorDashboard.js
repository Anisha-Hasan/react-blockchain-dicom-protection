import React, { useState, useEffect, useRef } from 'react';
import ProfileSettings from './ProfileSettings';
import './Dashboard.css';

function DoctorDashboard() {
  const [section, setSection] = useState('welcome');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const DoctorName = 'Dr. Smith';

  const requests = [
    { id: 1, patient: 'Mark', status: 'Approved' },
    { id: 2, patient: 'Sarah', status: 'Pending' },
    { id: 3, patient: 'John', status: 'Declined' },
  ];

  const patients = [
    { id: 'P001', name: 'Mark', permission: 'Granted' },
    { id: 'P002', name: 'Sarah', permission: 'Pending' },
    { id: 'P003', name: 'John', permission: 'Declined' },
  ];

  const sidebarRef = useRef(null);

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
          DoctorPortal
        </h2>
        <ul>
          <li onClick={() => { setSection('profile'); closeSidebar(); }}>Profile Settings</li>
          <li onClick={() => { setSection('requests'); closeSidebar(); }}>My Requests</li>
          <li onClick={() => { setSection('patients'); closeSidebar(); }}>My Patients</li>
          <li onClick={() => { setSection('help'); closeSidebar(); }}>Help/About</li>
          <li onClick={() => alert('Logging out')} style={{ color: 'red' }}>Logout</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {section === 'welcome' && (
          <div>
            <h2>Welcome <span className="highlight">{DoctorName}!</span></h2>
            <p>Here’s a quick look at your dashboard. (You can add stats and shortcuts later!)</p>
          </div>
        )}

        {section === 'profile' && (
          <ProfileSettings name={DoctorName} uniqueId="S001" role="Doctor" />
        )}

        {section === 'requests' && (
          <div>
            <h2>My Requests</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Patient</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id}>
                    <td>{req.id}</td>
                    <td>{req.patient}</td>
                    <td>{req.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {section === 'patients' && (
          <div>
            <h2>My Patients</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>Name</th>
                  <th>Permission Status</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>{p.permission}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {section === 'help' && (
          <div>
            <h2>Help / About</h2>
            <p>
              This system allows medical staff to request and manage access to patients’ DICOM medical images securely.
              If you need help, contact the IT admin or check the user guide.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default DoctorDashboard;
