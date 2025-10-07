import React, { useState, useEffect, useRef } from 'react';
import ProfileSettings from './ProfileSettings';
import MyRequests from './MyRequests';
import './Dashboard.css';
import './Logs.css';
import Chat from './Chat';
import { FaFileMedical, FaQuestionCircle } from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';
import { IoPeopleSharp } from "react-icons/io5";
import { RiLogoutBoxLine } from "react-icons/ri";
import MyPatients from './MyPatient';

function DoctorDashboard() {
  const [section, setSection] = useState('welcome');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const doctorName = 'Dr. Smith';

  // Example patients data
  const patients = [
    { id: 'P001', name: 'Mark', permission: 'Granted' },
    { id: 'P002', name: 'Sarah', permission: 'Pending' },
    { id: 'P003', name: 'John', permission: 'Declined' },
  ];

  // Sidebar toggling
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Close sidebar when clicking outside
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
      {/* Hamburger Menu */}
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
          <MyRequests />
        )}

        {section === 'patients' && (
          <MyPatients doctorId="68b0304a83eb31bebeeec4ad"/>
        )}

        {section === 'help' && (
          <div>
            <h2>Help / About</h2>
            <p>This portal helps you securely request and manage patient DICOM access.</p>
          </div>
        )}
      </main>

      {/* Floating Chat: only visible on Requests & Patients */}
      {(section === 'requests' || section === 'patients') && <Chat role="doctor" />}
    </div>
  );
}

export default DoctorDashboard;
