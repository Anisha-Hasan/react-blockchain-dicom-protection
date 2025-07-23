import React, { useState, useEffect, useRef } from 'react';
import ProfileSettings from './ProfileSettings';
import './Dashboard.css';

import crypto from 'crypto-js';

function StaffDashboard() {
  const [section, setSection] = useState('welcome');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const staffName = 'John Doe'; 

  const [patientID, setPatientID] = useState('');
  const [patientName, setPatientName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileHash, setFileHash] = useState('');
  const [ipfsLink, setIpfsLink] = useState('');
  const [status, setStatus] = useState('');

  const sidebarRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith('.dcm')) {
      setSelectedFile(file);
      setStatus('');
    } else {
      setStatus('Please select a valid .dcm file.');
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!patientID || !patientName || !selectedFile) {
      setStatus('Please fill all fields and select a valid file.');
      return;
    }

    try {
      const fileBuffer = await selectedFile.arrayBuffer();
      const wordArray = crypto.lib.WordArray.create(fileBuffer);
      const hash = crypto.SHA256(wordArray).toString();
      setFileHash(hash);

      const fakeCID = 'QmExampleFakeCID123456789';
      setIpfsLink(`https://ipfs.io/ipfs/${fakeCID}`);
      setStatus(`DICOM uploaded successfully!`);
    } catch (error) {
      console.error(error);
      setStatus('Error uploading file.');
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // ✅ Close sidebar when clicking outside
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
          StaffPortal
        </h2>
        <ul>
          <li onClick={() => { setSection('profile'); closeSidebar(); }}>Settings</li>
          <li onClick={() => { setSection('upload'); closeSidebar(); }}>Upload DICOM</li>
          <li onClick={() => { setSection('log'); closeSidebar(); }}>Upload Log</li>
          <li onClick={() => { setSection('help'); closeSidebar(); }}>Help/About</li>
          <li onClick={() => alert('Logging out')} style={{ color: 'red' }}>Logout</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {section === 'welcome' && (
          <div>
            <h2>Welcome <span className="highlight">{staffName}!</span></h2>
            <p>Use the menu to upload DICOMs or manage your profile.</p>
          </div>
        )}

        {section === 'profile' && (
          <ProfileSettings name={staffName} uniqueId="ST001" role="Staff" />
        )}

        {section === 'upload' && (
          <div>
            <h2>Upload DICOM</h2>
            <div className="mb-3">
              <label>Patient ID</label>
              <input
                type="text"
                className="form-control"
                value={patientID}
                onChange={(e) => setPatientID(e.target.value)}
                placeholder="Enter Patient ID"
              />
            </div>

            <div className="mb-3">
              <label>Patient Name</label>
              <input
                type="text"
                className="form-control"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Enter Patient Name"
              />
            </div>

            <div className="mb-3">
              <label>Choose DICOM File (.dcm only)</label>
              <input
                type="file"
                className="form-control"
                accept=".dcm"
                onChange={handleFileChange}
              />
            </div>

            <button className="btn btn-primary" onClick={handleUpload}>
              Upload
            </button>

            {fileHash && (
              <div className="mt-3">
                <strong>File Hash (SHA-256):</strong>
                <p>{fileHash}</p>
              </div>
            )}

            {ipfsLink && (
              <div className="mt-2">
                <strong>IPFS Link:</strong>
                <a href={ipfsLink} target="_blank" rel="noreferrer">
                  {ipfsLink}
                </a>
              </div>
            )}

            {status && (
              <div className="mt-2">
                <p>{status}</p>
              </div>
            )}
          </div>
        )}

        {section === 'log' && (
          <div>
            <h2>Upload Log</h2>
            <p>Coming soon: View all uploaded DICOMs with timestamps and status.</p>
          </div>
        )}

        {section === 'help' && (
          <div>
            <h2>Help / About</h2>
            <p>
              Use this portal to securely upload DICOM files, link them to patients, and generate blockchain records.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default StaffDashboard;
