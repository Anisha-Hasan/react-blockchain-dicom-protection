import React, { useState } from 'react';
import './Dashboard.css';

function StaffDashboard() {
  const [section, setSection] = useState('profile');

  const staffName = 'Dr. Smith';

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

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Staff Dashboard</h2>
        <ul>
          <li onClick={() => setSection('profile')}>Profile Settings</li>
          <li onClick={() => setSection('requests')}>My Requests</li>
          <li onClick={() => setSection('patients')}>My Patients</li>
          <li onClick={() => setSection('help')}>Help/About</li>
          <li onClick={() => alert('Logging out')} style={{ color: 'red' }}>Logout</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {section === 'profile' && (
          <div>
            <h2>Welcome, {staffName}!</h2>
            <p>Profile settings will go here. (Coming soon!)</p>
          </div>
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

export default StaffDashboard;
