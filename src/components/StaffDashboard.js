import React, { useState } from 'react';

function StaffDashboard() {
  const [section, setSection] = useState('profile');

  const staffName = 'Dr. Smith';

  // Dummy data for requests
  const requests = [
    { id: 1, patient: 'Mark', status: 'Approved' },
    { id: 2, patient: 'Sarah', status: 'Pending' },
    { id: 3, patient: 'John', status: 'Declined' },
  ];

  // Dummy data for patients
  const patients = [
    { id: 'P001', name: 'Mark', permission: 'Granted' },
    { id: 'P002', name: 'Sarah', permission: 'Pending' },
    { id: 'P003', name: 'John', permission: 'Declined' },
  ];

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <nav className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse" style={{ height: '100vh' }}>
          <div className="position-sticky pt-3">
            <h4 className="text-center mb-4">Staff Dashboard</h4>
            <ul className="nav flex-column">
              <li className="nav-item">
                <button className="nav-link btn btn-link text-start" onClick={() => setSection('profile')}>
                  Profile Settings
                </button>
              </li>
              <li className="nav-item">
                <button className="nav-link btn btn-link text-start" onClick={() => setSection('requests')}>
                  My Requests
                </button>
              </li>
              <li className="nav-item">
                <button className="nav-link btn btn-link text-start" onClick={() => setSection('patients')}>
                  My Patients
                </button>
              </li>
              <li className="nav-item">
                <button className="nav-link btn btn-link text-start" onClick={() => setSection('help')}>
                  Help/About
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link text-start text-danger"
                  onClick={() => alert('Logging out')}
                >
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
          </div>
        </main>
      </div>
    </div>
  );
}

export default StaffDashboard;
