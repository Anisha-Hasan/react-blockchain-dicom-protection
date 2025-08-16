import React, { useState, useEffect, useRef } from 'react';
import ProfileSettings from './ProfileSettings';
import './Dashboard.css';
import './Logs.css';
import Chat from './Chat';
import { FaFileMedical, FaQuestionCircle } from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';
import { IoPeopleSharp } from "react-icons/io5";
import { RiLogoutBoxLine } from "react-icons/ri";
import { LuRefreshCw } from "react-icons/lu";

function DoctorDashboard() {
  const [section, setSection] = useState('welcome');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const doctorName = 'Dr. Smith';

  const requests = [
    { id: 1, patient: 'Mark', reason: 'MRI Review', date: '2025-07-21', status: 'Approved' },
    { id: 2, patient: 'Sarah', reason: 'Consult', date: '2025-07-20', status: 'Pending' },
    { id: 3, patient: 'John', reason: 'Follow-up', date: '2025-07-19', status: 'Declined' },
  ];

  const patients = [
    { id: 'P001', name: 'Mark', permission: 'Granted' },
    { id: 'P002', name: 'Sarah', permission: 'Pending' },
    { id: 'P003', name: 'John', permission: 'Declined' },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Dummy Gas Fee Data
  const [gasPrice, setGasPrice] = useState("25 Gwei");
  const [gasCost, setGasCost] = useState("0.002 ETH (~$3.50)");
  const [gasStatus, setGasStatus] = useState("Normal");
  const [lastUpdated, setLastUpdated] = useState("2025-08-10 14:00");

  const refreshGasFee = () => {
    // Just updating with new dummy values
    setGasPrice("28 Gwei");
    setGasCost("0.0022 ETH (~$3.80)");
    setGasStatus("Slightly High");
    setLastUpdated(new Date().toLocaleString());
  };

  // Function to determine class based on gas status instead of Gwei value
  const getGasStatusClass = () => {
    const statusLower = gasStatus.toLowerCase();
    if (statusLower.includes("low")) return "low-fee";
    if (statusLower.includes("high")) return "high-fee";
    return "medium-fee"; // for normal
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
        <h2
          onClick={() => { setSection('welcome'); closeSidebar(); }}
          style={{ cursor: 'pointer' }}
          className="gradient-text"
        >
          DoctorPortal
        </h2>
        <div className="nav-section">
          <ul>
            <li onClick={() => { setSection('profile'); closeSidebar(); }}>
              <IoMdSettings className="icon" /> Profile Settings
            </li>
            <li onClick={() => { setSection('requests'); closeSidebar(); }}>
              <FaFileMedical className="icon" /> My Requests
            </li>
            <li onClick={() => { setSection('patients'); closeSidebar(); }}>
              <IoPeopleSharp className="icon" /> My Patients
            </li>
            <li onClick={() => { setSection('help'); closeSidebar(); }}>
              <FaQuestionCircle className="icon" /> Help/About
            </li>
          </ul>
        </div>
        <div className="logout-button" onClick={() => alert('Logging out')}>
          <RiLogoutBoxLine className="icon" /> Logout
        </div>
      </aside>

      {/* Main Content */}
      <main className={`main-content ${isSidebarOpen ? 'shifted' : ''}`}>
        {section === 'welcome' && (
          <div>
            <h2>Welcome <span className="highlight">{doctorName}!</span></h2>
            <p>Use this portal to manage your requests and patients securely.</p>
          </div>
        )}

        {section === 'profile' && (
          <ProfileSettings name={doctorName} uniqueId="D001" role="Doctor" />
        )}

        {section === 'requests' && (
          <div>
            <h2>My Requests</h2>
            <button className="btn btn-primary mb-2">+ New Request</button>

            {/* Stats Section */}
            <div className="dicom-stats">
              <div className="dicom-stat-card">
                <h3>No. of Request Granted</h3>
                <p className="stat-value">12</p>

                {/* NEW - Gas Fee Section */}
                <div className="gas-fee-mini">
                  <strong>Gas Used:</strong> 0.015 ETH (~$25.00)
                </div>

                <button
                  className="dicom-stat-button"
                  onClick={() => {
                    const todayRow = document.getElementById("today-table");
                    if (todayRow) {
                      todayRow.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  View
                </button>
              </div>

              <div className="dicom-stat-card">
                <h3>No. of Request Revoked</h3>
                <p className="stat-value">12</p>

                {/* NEW - Gas Fee Section */}
                <div className="gas-fee-mini">
                  <strong>Gas Used:</strong> 0.015 ETH (~$25.00)
                </div>

                <button
                  className="dicom-stat-button"
                  onClick={() => {
                    const todayRow = document.getElementById("today-table");
                    if (todayRow) {
                      todayRow.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  View
                </button>
              </div>

              <div className="dicom-stat-card">
                <h3>No. of Request Pending</h3>
                <p className="stat-value">3</p>

                {/* NEW - Gas Fee Section */}
                <div className="gas-fee-mini">
                  <strong>Gas Used:</strong> 0.004 ETH (~$6.70)
                </div>

                <button
                  className="dicom-stat-button"
                  onClick={() => {
                    const todayRow = document.getElementById("today-table");
                    if (todayRow) {
                      todayRow.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  View
                </button>
              </div>
            </div>

            {/* Gas Fee Tracker Card */}
            <div className="gas-fee-container">
              <div className="card gas-fee-card">
                <div className="gas-fee-header">
                  <h3>Gas Fee Tracker</h3>
                  <button className="refresh-btn" onClick={refreshGasFee}>
                    <LuRefreshCw size={18} />
                  </button>
                </div>

                <div className="gas-fee-main">
                  <span className="gas-price">{gasPrice}</span>
                  <span className="gas-cost">{gasCost}</span>
                </div>

                <div className={`gas-status ${getGasStatusClass()}`}>
                  Status: {gasStatus}
                </div>
                <div className="gas-updated">Updated: {lastUpdated}</div>
              </div>
            </div>

            {requests.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Patient</th>
                    <th>Reason</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req.id}>
                      <td>{req.id}</td>
                      <td>{req.patient}</td>
                      <td>{req.reason}</td>
                      <td>{req.date}</td>
                      <td>
                        <span className={`badge ${req.status.toLowerCase()}`}>{req.status}</span>
                      </td>
                      <td>
                        {req.status === 'Pending' && (
                          <button className="btn btn-danger btn-sm">Cancel</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No requests yet.</p>
            )}
          </div>
        )}

        {section === 'patients' && (
          <div>
            <h2>My Patients</h2>
            {patients.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Patient ID</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.name}</td>
                      <td>
                        <span className={`badge ${p.permission.toLowerCase()}`}>{p.permission}</span>
                      </td>
                      <td>
                        {p.permission === 'Granted' ? (
                          <button className="btn btn-primary btn-sm">View DICOMs</button>
                        ) : (
                          <button className="btn btn-secondary btn-sm">Request Access</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No patients yet.</p>
            )}
          </div>
        )}

        {section === 'help' && (
          <div>
            <h2>Help / About</h2>
            <p>This portal helps you securely request and manage patient DICOM access.</p>
          </div>
        )}
      </main>

      {/* Floating Chat Component: Only on Requests & Patients */}
      {(section === 'requests' || section === 'patients') && <Chat role="doctor" />}
    </div>
  );
}

export default DoctorDashboard;
