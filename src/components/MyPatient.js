import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Logs.css"; // for table styles etc.

function MyPatients({ doctorId }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMyPatients = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:4000/api/patients/by-doctor/${doctorId}`);
        setPatients(res.data || []);
      } catch (error) {
        console.error("Error fetching doctor’s patients:", error);
        setMessage("❌ Failed to fetch patients");
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchMyPatients();
    }
  }, [doctorId]);

  if (loading) return <p>Loading your patients...</p>;
  if (message) return <p>{message}</p>;

  return (
    <div>
      <h2>My Patients</h2>
      {patients.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Patient ID</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>DICOM Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p._id}>
                <td>{p.patientID}</td>
                <td>{p.patientName}</td>
                <td>{p.mobile}</td>
                <td>{p.dicomFiles?.length || 0}</td>
                <td>
                  <button className="btn btn-primary btn-sm">
                    View DICOMs
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No patients tagged to you yet.</p>
      )}
    </div>
  );
}

export default MyPatients;
