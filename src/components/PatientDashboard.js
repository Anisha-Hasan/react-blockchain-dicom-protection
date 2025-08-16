import React, { useState, useEffect, useRef } from 'react';
import ProfileSettings from './ProfileSettings';
import './Dashboard.css';
import './Logs.css';
import Chat from './Chat';
import { FaFileMedical, FaRegImages, FaQuestionCircle } from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';
import { LuLogs } from "react-icons/lu";
import { RiLogoutBoxLine } from "react-icons/ri";
import { LuRefreshCw } from "react-icons/lu";

function PatientDashboard() {
  const [section, setSection] = useState('welcome');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const sidebarRef = useRef(null);
  const patientName = 'Mark';

  const [accessRequests, setAccessRequests] = useState([
    { id: 1, doctor: 'Dr. Smith', reason: 'Needs to review MRI scan', status: 'Pending', gasFee: '0.00021 ETH' },
    { id: 2, doctor: 'Dr. Johnson', reason: 'Consult for treatment plan', status: 'Pending', gasFee: '0.00018 ETH' }
  ]);

  const myDicoms = [
    { id: 1, name: 'Brain_MRI.dcm', uploadedBy: 'Staff John Doe', date: '2025-07-23' },
    { id: 2, name: 'Chest_Xray.dcm', uploadedBy: 'Staff Jane Doe', date: '2025-07-20' }
  ];

  const accessLog = [
    { id: 1, doctor: 'Dr. Smith', dicomName: 'Brain_MRI.dcm', date: '2025-07-23', status: 'Granted' },
    { id: 2, doctor: 'Dr. Johnson', dicomName: 'Chest_Xray.dcm', date: '2025-07-22', status: 'Revoked' },
    { id: 3, doctor: 'Dr. Brown', dicomName: 'Spine_CT.dcm', date: '2025-07-21', status: 'Granted' }
  ];

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


  const handleAccept = (id) => {
    setAccessRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: 'Accepted' } : req
      )
    );
  };

  const handleDecline = (id) => {
    setAccessRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: 'Declined' } : req
      )
    );
  };

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

  const navItemClass = (value) =>
    `nav-item ${section === value ? 'selected' : ''}`;

  const getStatusColor = (status) => {
    if (status === 'Accepted') return 'green';
    if (status === 'Declined') return 'red';
    return 'orange';
  };

  return (
    <div className={`dashboard-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <div className="hamburger" onClick={toggleSidebar}>
        &#9776;
      </div>

      <aside ref={sidebarRef} className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <h2 onClick={() => { setSection('welcome'); closeSidebar(); }} style={{ cursor: 'pointer' }} className="gradient-text">
          My Health
        </h2>

        <div className="nav-section">
          <ul>
            <li className={navItemClass('profile')} onClick={() => { setSection('profile'); closeSidebar(); }}>
              <IoMdSettings className="icon" /> Profile Settings
            </li>
            <li className={navItemClass('requests')} onClick={() => { setSection('requests'); closeSidebar(); }}>
              <FaFileMedical className="icon" /> Access Requests
            </li>
            <li className={navItemClass('dicoms')} onClick={() => { setSection('dicoms'); closeSidebar(); }}>
              <FaRegImages className="icon" /> My DICOMs
            </li>
            <li className={navItemClass('log')} onClick={() => { setSection('log'); closeSidebar(); }}>
              <LuLogs className="icon" /> Access Log
            </li>
            <li className={navItemClass('help')} onClick={() => { setSection('help'); closeSidebar(); }}>
              <FaQuestionCircle className="icon" /> Help/About
            </li>
          </ul>
        </div>

        <div className="logout-button" onClick={() => alert('Logging out')}>
          <RiLogoutBoxLine className="icon" /> Logout
        </div>
      </aside>

      <main className={`main-content ${isSidebarOpen ? 'shifted' : ''}`}>
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
            {accessRequests.length === 0 ? (
              <p>No pending requests.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Doctor</th>
                    <th>Reason</th>
                    <th>Gas Fee</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {accessRequests.map((req) => (
                    <tr key={req.id}>
                      <td>{req.id}</td>
                      <td>{req.doctor}</td>
                      <td>{req.reason}</td>
                      <td>{req.gasFee}</td>
                      <td style={{ color: getStatusColor(req.status), fontWeight: 'bold' }}>{req.status}</td>
                      <td>
                        {req.status === 'Pending' ? (
                          <>
                            <button className="btn btn-success btn-sm" onClick={() => handleAccept(req.id)}>Accept</button>{' '}
                            <button className="btn btn-danger btn-sm" onClick={() => handleDecline(req.id)}>Decline</button>
                          </>
                        ) : <span>—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <Chat userRole="patient" userId="patient123" />
          </div>
        )}

        {section === 'dicoms' && (
          <div>
            <h2>My DICOMs</h2>
            {myDicoms.length === 0 ? (
              <p>No DICOM files found.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>File Name</th>
                    <th>Uploaded By</th>
                    <th>Upload Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myDicoms.map((dicom) => (
                    <tr key={dicom.id}>
                      <td>{dicom.id}</td>
                      <td>{dicom.name}</td>
                      <td>{dicom.uploadedBy}</td>
                      <td>{dicom.date}</td>
                      <td>
                        <button className="btn btn-primary btn-sm">Download</button>{' '}
                        <button className="btn btn-warning btn-sm">Revoke Access</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {section === 'log' && (
          <div>
            <h2>Access Log</h2>

            {/* Stats Section */}
            <div className="dicom-stats">
              <div className="dicom-stat-card">
                <h3>No. of Request <span style={{ color: 'green' }}>Granted</span></h3>
                <p className="stat-value">
                  {accessLog.filter(log => log.status === 'Granted').length}
                </p>

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
                <h3>No. of Request <span style={{ color: 'red' }}>Revoked</span></h3>
                <p className="stat-value">
                  {accessLog.filter(log => log.status === 'Revoked').length}
                </p>

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
                <h3>No. of Request <span style={{ color: 'orange' }}>Pending</span></h3>
                <p className="stat-value">
                  {accessRequests.filter(req => req.status === 'Pending').length}
                </p>

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


            {accessLog.length === 0 ? (
              <p>No access logs yet.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Doctor</th>
                    <th>DICOM File</th>
                    <th>Date Accessed</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {accessLog.map((log) => (
                    <tr key={log.id}>
                      <td>{log.id}</td>
                      <td>{log.doctor}</td>
                      <td>{log.dicomName}</td>
                      <td>{log.date}</td>
                      <td>{log.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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
