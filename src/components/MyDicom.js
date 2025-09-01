import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

function MyDicoms() {
  const [dicoms, setDicoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDicoms = async () => {
      try {
        setLoading(true);
        setError(null);

        // 🔹 Get patientID from localStorage
        const patientID = localStorage.getItem("patientID");

        if (!patientID) {
          setError("No patient ID found in localStorage.");
          setLoading(false);
          return;
        }

        // 🔹 Fetch from backend
        const res = await axios.get(`http://localhost:4000/api/patients/${patientID}/dicoms`);
        setDicoms(res.data);
        setLoading(false);
      } catch (err) {
        console.error("❌ Fetch error:", err);
        setError("Failed to fetch DICOM files");
        setLoading(false);
      }
    };

    fetchDicoms();
  }, []); // no props dependency

  if (loading) return <p>Loading DICOM files...</p>;
  if (error) return <p>{error}</p>;
  if (dicoms.length === 0) return <p>No DICOM files found.</p>;

  return (
    <div>
      <h2>My DICOMs</h2>
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>File Name</th>
            <th>Uploaded At</th>
            <th>IPFS Link</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {dicoms.map((dicom, index) => (
            <tr key={dicom._id}>
              <td>{index + 1}</td>
              <td>{dicom.filename}</td>
              <td>{new Date(dicom.uploadedAt).toLocaleString()}</td>
              <td>
                <a href={dicom.ipfsLink} target="_blank" rel="noopener noreferrer">
                  View
                </a>
              </td>
              <td>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => window.open(dicom.ipfsLink, "_blank")}
                >
                  Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MyDicoms;
