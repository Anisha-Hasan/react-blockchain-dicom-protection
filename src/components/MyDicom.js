import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";

function MyDicoms() {
  const [dicoms, setDicoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDicoms = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ Get patientID from localStorage
        const patientID = localStorage.getItem("patientID");

        if (!patientID) {
          setError("⚠️ No patient ID found. Please log in again.");
          setLoading(false);
          return;
        }

        // ✅ Fetch from backend
        const res = await axios.get(`http://localhost:4000/api/patients/${patientID}/dicoms`);
        setDicoms(res.data || []);
      } catch (err) {
        console.error("❌ Error fetching DICOM files:", err);
        setError("Failed to fetch DICOM files. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDicoms();
  }, []);

  if (loading)
    return (
      <div className="loading-message">
        <p>⏳ Loading your DICOM files...</p>
      </div>
    );

  if (error)
    return (
      <div className="error-message">
        <p>{error}</p>
      </div>
    );

  if (dicoms.length === 0)
    return (
      <div className="no-data">
        <p>No DICOM files found for your account.</p>
      </div>
    );

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">🩻 My DICOM Files</h2>

      <div className="table-container">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>File Name</th>
              <th>Uploaded On</th>
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
                  <a
                    href={dicom.ipfsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ipfs-link"
                  >
                    Open in IPFS
                  </a>
                </td>
                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => window.open(dicom.ipfsLink, "_blank")}
                  >
                    View / Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MyDicoms;
