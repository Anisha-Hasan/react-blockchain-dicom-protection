import React, { useState, useEffect, useRef } from 'react';
import ProfileSettings from './ProfileSettings';
import './Dashboard.css';
import { FaFileMedical, FaRegImages, FaSignOutAlt, FaQuestionCircle} from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';
import { LuLogs } from "react-icons/lu";
import { RiLogoutBoxLine } from "react-icons/ri";

function PatientDashboard() {
  const [section, setSection] = useState('welcome');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const patientName = 'Mark';

  const [accessRequests, setAccessRequests] = useState([
    { id: 1, doctor: 'Dr. Smith', reason: 'Needs to review MRI scan', status: 'Pending' },
    { id: 2, doctor: 'Dr. Johnson', reason: 'Consult for treatment plan', status: 'Pending' }
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
            {accessRequests.length === 0 ? (
              <p>No pending requests.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Doctor</th>
                    <th>Reason</th>
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
                      <td>{req.status}</td>
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
