
import React, { useState } from 'react';
import ProfileSettings from './ProfileSettings';
import './Dashboard.css';
import './UploadDicom.css';
import './Logs.css';
import crypto from 'crypto-js';
import { FaUpload, FaClipboardList, FaQuestionCircle } from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';
import { RiLogoutBoxLine } from "react-icons/ri";
import { LuRefreshCw } from "react-icons/lu";

function AdminDashboard() {
  const [section, setSection] = useState('welcome');

  const adminName = 'John Doe';

  const [patientID, setPatientID] = useState('');
  const [patientName, setPatientName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileHash, setFileHash] = useState('');
  const [ipfsLink, setIpfsLink] = useState('');
  const [status, setStatus] = useState('');

  // Dummy Upload Log
  const uploadLog = [
    {
      id: 1,
      patientID: 'P001',
      patientName: 'Mark',
      fileName: 'brain_scan.dcm',
      uploadedAt: '2025-07-22 14:35',
      status: 'Success',
      hash: 'c9f0f895fb98ab9159f51fd0297e236d',
      ipfs: 'https://ipfs.io/ipfs/QmExampleCID1',
    },
    {
      id: 2,
      patientID: 'P002',
      patientName: 'Sarah',
      fileName: 'chest_scan.dcm',
      uploadedAt: '2025-07-22 15:10',
      status: 'Success',
      hash: '45c48cce2e2d7fbdea1afc51c7c6ad26',
      ipfs: 'https://ipfs.io/ipfs/QmExampleCID2',
    },
  ];

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

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar open">
        <h2
          onClick={() => setSection('welcome')}
          style={{ cursor: 'pointer' }}
          className="gradient-text"
        >
          Hi Admin
        </h2>

        <div className="nav-section">
          <ul>
            <li onClick={() => setSection('profile')}>
              <IoMdSettings className="icon" /> Settings
            </li>
            <li onClick={() => setSection('upload')}>
              <FaUpload className="icon" /> Upload DICOM
            </li>
            <li onClick={() => setSection('log')}>
              <FaClipboardList className="icon" /> Upload Log
            </li>
            <li onClick={() => setSection('help')}>
              <FaQuestionCircle className="icon" /> Help/About
            </li>
          </ul>
        </div>

        <div className="logout-button" onClick={() => alert('Logging out')}>
          <RiLogoutBoxLine className="icon" /> Logout
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {section === 'welcome' && (
          <div>
            <h2>
              Welcome <span className="highlight">{adminName}!</span>
            </h2>
            <p>Use the menu to upload DICOMs or manage your profile.</p>
          </div>
        )}

        {section === 'profile' && (
          <ProfileSettings name={adminName} uniqueId="ST001" role="Admin" />
        )}

        {section === 'upload' && (
          <div className="upload-dicom-container">
            <div className="upload-card">
              <h1>Upload DICOM</h1>

              <div className="form-row">
                <div className="form-group">
                  <label>Patient ID</label>
                  <input
                    type="text"
                    value={patientID}
                    onChange={(e) => setPatientID(e.target.value)}
                    placeholder="Enter Patient ID"
                  />
                </div>

                <div className="form-group">
                  <label>Patient Name</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Enter Patient Name"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Choose DICOM File (.dcm only)</label>
                <input
                  type="file"
                  accept=".dcm"
                  onChange={handleFileChange}
                  className="dicom-file-input"
                />
              </div>

              <div className="button-row">
                <button className="upload-btn" onClick={handleUpload}>
                  Upload
                </button>
              </div>

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
          </div>
        )}

        {section === 'log' && (
          <div>
            <h2>Upload Log</h2>

            {/* Stats Section */}
            <div className="dicom-stats">
              <div className="dicom-stat-card">
                <h3>No. of DICOM Uploaded This Week</h3>
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
                  View This Week’s Uploads
                </button>
              </div>
              <div className="dicom-stat-card">
                <h3>No. of DICOM Uploaded Today</h3>
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
                  View Today’s Uploads
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

            {/* Today's Upload History */}
            <h4 id="today-table">Today's Upload History</h4>
            <table className="dicom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient ID</th>
                  <th>Patient Name</th>
                  <th>File</th>
                  <th>Uploaded At</th>
                  <th>Status</th>
                  <th>Hash</th>
                  <th>IPFS Link</th>
                </tr>
              </thead>
              <tbody>
                {uploadLog.map((log) => (
                  <tr key={log.id}>
                    <td>{log.id}</td>
                    <td>{log.patientID}</td>
                    <td>{log.patientName}</td>
                    <td>{log.fileName}</td>
                    <td>{log.uploadedAt}</td>
                    <td>{log.status}</td>
                    <td>{log.hash.slice(0, 10)}...</td>
                    <td>
                      <a href={log.ipfs} target="_blank" rel="noreferrer">
                        Link
                      </a>
                    </td>
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
              Use this portal to securely upload DICOM files, link them to patients, and generate blockchain records.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
