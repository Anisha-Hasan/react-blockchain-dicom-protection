import React, { useState } from 'react';
import './Dashboard.css';
import './Logs.css';
import { LuRefreshCw } from "react-icons/lu";

const MyRequests = () => {
  // Dummy Requests Data
  const [requests, setRequests] = useState([
    {
      id: "R001",
      patient: "Mark",
      reason: "Follow-up check",
      date: "2025-08-10",
      status: "Granted",
    },
    {
      id: "R002",
      patient: "Sarah",
      reason: "Lab test review",
      date: "2025-08-12",
      status: "Pending",
    },
    {
      id: "R003",
      patient: "John",
      reason: "MRI access",
      date: "2025-08-15",
      status: "Declined",
    },
  ]);

  // Dummy Gas Fee Data
  const [gasPrice, setGasPrice] = useState("25 Gwei");
  const [gasCost, setGasCost] = useState("0.002 ETH (~$3.50)");
  const [gasStatus, setGasStatus] = useState("Normal");
  const [lastUpdated, setLastUpdated] = useState("2025-08-10 14:00");

  // New Request Search
  const [showSearch, setShowSearch] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const refreshGasFee = () => {
    setGasPrice("28 Gwei");
    setGasCost("0.0022 ETH (~$3.80)");
    setGasStatus("Slightly High");
    setLastUpdated(new Date().toLocaleString());
  };

  const getGasStatusClass = () => {
    const statusLower = gasStatus.toLowerCase();
    if (statusLower.includes("low")) return "low-fee";
    if (statusLower.includes("high")) return "high-fee";
    return "medium-fee";
  };

  const handleSearch = () => {
    const result = requests.find((req) => req.id.toLowerCase() === patientId.toLowerCase());
    setSearchResult(result || { id: "Not Found", patient: "-", reason: "-", date: "-", status: "-" });
  };

  return (
    <div>
      <h2>My Requests</h2>

      {/* New Request + Search in one row */}
      <div className="d-flex align-items-center mb-3">
        <button
          className="btn btn-primary me-3"
          onClick={() => setShowSearch(!showSearch)}
        >
          + New Request
        </button>
        {showSearch && (
          <div className="d-flex flex-grow-1">
            <input
              type="text"
              className="form-control custom-input me-2"
              placeholder="Enter Patient ID (e.g. R001)"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
            />
            <button className="btn btn-success" onClick={handleSearch}>
              Search
            </button>
          </div>
        )}
      </div>

      {/* Show search result below */}
      {searchResult && (
        <div className="card p-3 mb-3">
          <h5>Search Result:</h5>
          <table className="table table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Reason</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{searchResult.id}</td>
                <td>{searchResult.patient}</td>
                <td>{searchResult.reason}</td>
                <td>{searchResult.date}</td>
                <td>{searchResult.status}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Stats Section */}
      <div className="dicom-stats">
        <div className="dicom-stat-card">
          <h3>No. of Request Granted</h3>
          <p className="stat-value">12</p>
          <div className="gas-fee-mini"><strong>Gas Used:</strong> 0.015 ETH (~$25.00)</div>
          <button className="dicom-stat-button">View</button>
        </div>

        <div className="dicom-stat-card">
          <h3>No. of Request Revoked</h3>
          <p className="stat-value">12</p>
          <div className="gas-fee-mini"><strong>Gas Used:</strong> 0.015 ETH (~$25.00)</div>
          <button className="dicom-stat-button">View</button>
        </div>

        <div className="dicom-stat-card">
          <h3>No. of Request Pending</h3>
          <p className="stat-value">3</p>
          <div className="gas-fee-mini"><strong>Gas Used:</strong> 0.004 ETH (~$6.70)</div>
          <button className="dicom-stat-button">View</button>
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
          <div className={`gas-status ${getGasStatusClass()}`}>Status: {gasStatus}</div>
          <div className="gas-updated">Updated: {lastUpdated}</div>
        </div>
      </div>

      {/* Requests Table */}
      {requests.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Reason</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id} id={req.id === "R002" ? "today-table" : ""}>
                <td>{req.id}</td>
                <td>{req.patient}</td>
                <td>{req.reason}</td>
                <td>{req.date}</td>
                <td><span className={`badge ${req.status.toLowerCase()}`}>{req.status}</span></td>
                <td>
                  {req.status === "Pending" && (
                    <button className="btn btn-danger btn-sm">Cancel</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No requests yet.</p>
      )}
    </div>
  );
};

export default MyRequests;
