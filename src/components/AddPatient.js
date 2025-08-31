import React, { useState } from "react";
import axios from "axios";
import './Dashboard.css';
import './UploadDicom.css';

function AddPatient() {
  const [patientID, setPatientID] = useState("");
  const [patientName, setPatientName] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!patientID || !patientName || !password || !mobile) {
      alert("⚠️ Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      // ✅ Axios POST request to backend
      const response = await axios.post("http://localhost:4000/api/patients", {
        patientID,     // ✅ matches state
        patientName,   // ✅ matches state
        password,      // ✅ matches state
        mobile
      });

      if (response.status === 201 || response.status === 200) {
        alert(`✅ Patient ${patientName} (ID: ${patientID}) added successfully!`);
        setPatientID("");
        setPatientName("");
        setPassword("");
        setMobile("");
      } else {
        alert(`❌ Error: ${response.data.message || "Could not add patient"}`);
      }
    } catch (error) {
      console.error("Error adding patient:", error);
      alert(`❌ Server Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-patient-container">
      <div className="add-patient-card">
        <h2>Add New Patient</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Patient ID</label>
            <input
              type="text"
              value={patientID}
              onChange={(e) => setPatientID(e.target.value)}
              placeholder="Enter unique Patient ID"
              required
            />
          </div>

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Set patient password"
              required
            />
          </div>

          <div className="form-group">
            <label>Mobile No.</label>
            <input
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter mobile number"
              required
            />
          </div>

          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? "Adding..." : "Add Patient"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddPatient;
