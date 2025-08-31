import React, { useState } from 'react';
import crypto from 'crypto-js';
import './Dashboard.css';
import './UploadDicom.css';

function UploadDicom({ onUploadSuccess }) {
  const [patientID, setPatientID] = useState('');
  const [patientName, setPatientName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileHash, setFileHash] = useState('');
  const [ipfsLink, setIpfsLink] = useState('');
  const [status, setStatus] = useState('');

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
      // 1️⃣ Compute SHA-256 hash
      const fileBuffer = await selectedFile.arrayBuffer();
      const wordArray = crypto.lib.WordArray.create(fileBuffer);
      const hash = crypto.SHA256(wordArray).toString();
      setFileHash(hash);

      setStatus("Uploading...");

      // 2️⃣ Call backend API to store file info under patient
      const response = await fetch("http://localhost:4000/api/dicom/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientID,
          filename: selectedFile.name,
          hash
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus(data.message || "Upload failed");
        return;
      }

      // 3️⃣ Use backend-generated IPFS link for display
      const lastFile = data.dicomFiles[data.dicomFiles.length - 1];
      setIpfsLink(lastFile.ipfsLink);
      setStatus("DICOM uploaded successfully!");

      // 4️⃣ Notify parent to update upload log
      if (onUploadSuccess) {
        onUploadSuccess({
          patientID,
          patientName,
          fileName: selectedFile.name,
          uploadedAt: new Date().toLocaleString(),
          status: "Success",
          hash,
          ipfs: lastFile.ipfsLink
        });
      }

      // Reset file input
      setSelectedFile(null);
    } catch (error) {
      console.error(error);
      setStatus('Error uploading file.');
    }
  };

  return (
    <div className="upload-dicom-container">
      <div className="upload-card">
        <h1>Upload DICOM</h1>

        <div className="form-row">
          <div className="form-group">
            <label>Patient ID</label>
            <input type="text" value={patientID} onChange={(e) => setPatientID(e.target.value)} placeholder="Enter Patient ID" />
          </div>

          <div className="form-group">
            <label>Patient Name</label>
            <input type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Enter Patient Name" />
          </div>
        </div>

        <div className="form-group">
          <label>Choose DICOM File (.dcm only)</label>
          <input type="file" accept=".dcm" onChange={handleFileChange} className="dicom-file-input" />
        </div>

        <div className="button-row">
          <button className="upload-btn" onClick={handleUpload}>Upload</button>
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
            <a href={ipfsLink} target="_blank" rel="noreferrer">{ipfsLink}</a>
          </div>
        )}

        {status && <div className="mt-2"><p>{status}</p></div>}
      </div>
    </div>
  );
}

export default UploadDicom;
