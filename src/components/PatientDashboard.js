import React, { useState, useEffect, useRef } from 'react';
import ProfileSettings from './ProfileSettings';
import './Dashboard.css';
import './Logs.css';
import Chat from './Chat';
import { FaFileMedical, FaRegImages, FaQuestionCircle } from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';
import { LuLogs } from "react-icons/lu";
import { RiLogoutBoxLine } from "react-icons/ri";
import { LuRefreshCw } from "react-icons/lu";

const ETHERSCAN_API_KEY = process.env.REACT_APP_ETHERSCAN_API_KEY || 'YOUR_KEY_HERE';
const EST_GAS_UNITS = 50000; // reasonable default for simple write txs

function PatientDashboard() {
  const [section, setSection] = useState('welcome');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const sidebarRef = useRef(null);
  const patientName = 'Mark';

  // ------- Demo data -------
  const [accessRequests, setAccessRequests] = useState([
    // add optional txHash when you actually send a tx to get real gas used
    // { id: 99, doctor: 'Dr. Example', reason: 'demo', status: 'Accepted', gasFee: '-', txHash: '0x...' },
    { id: 1, doctor: 'Dr. Smith', reason: 'Needs to review MRI scan', status: 'Pending', gasFee: '—' },
    { id: 2, doctor: 'Dr. Johnson', reason: 'Consult for treatment plan', status: 'Pending', gasFee: '—' }
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

  // ===== Gas oracle + price =====
  const [gasPrice, setGasPrice] = useState("Loading...");
  const [gasBands, setGasBands] = useState({ safe: null, propose: null, fast: null });
  const [gasStatus, setGasStatus] = useState("Loading...");
  const [lastUpdated, setLastUpdated] = useState("Never");
  const [ethUsd, setEthUsd] = useState(null);

  // Aggregates for the 3 cards
  const [cardGas, setCardGas] = useState({
    acceptedEth: 0,
    declinedEth: 0,
    pendingEstEth: 0
  });

  const formatEthUsd = (eth) => {
    const ethNum = Number(eth || 0);
    const ethStr = `${ethNum.toFixed(4)} ETH`;
    if (ethUsd) return `${ethStr} (~$${(ethNum * ethUsd).toFixed(2)})`;
    return ethStr;
  };

  // ---- Etherscan fetchers ----
  const fetchGasAndPrice = async () => {
    try {
      const [gasRes, priceRes] = await Promise.all([
        fetch(`https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${ETHERSCAN_API_KEY}`),
        fetch(`https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${ETHERSCAN_API_KEY}`)
      ]);

      const gasData = await gasRes.json();
      const priceData = await priceRes.json();

      if (gasData.status === "1") {
        const safe = Number(gasData.result.SafeGasPrice);
        const propose = Number(gasData.result.ProposeGasPrice);
        const fast = Number(gasData.result.FastGasPrice);

        setGasBands({ safe, propose, fast });
        setGasPrice(`${propose} Gwei`);
        setGasStatus(`Low: ${safe} | Avg: ${propose} | High: ${fast}`);
        setLastUpdated(new Date().toLocaleString());
      } else {
        setGasPrice("Error");
        setGasStatus("Failed to fetch");
      }

      if (priceData.status === "1") {
        setEthUsd(Number(priceData.result.ethusd));
      }
    } catch (e) {
      console.error("Gas/price fetch error:", e);
      setGasPrice("Error");
      setGasStatus("Check console");
    }
  };

  // Get actual gas used for a tx via receipt (proxy RPC)
  const fetchTxCostEth = async (txHash) => {
    try {
      const r = await fetch(
        `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionReceipt&txhash=${txHash}&apikey=${ETHERSCAN_API_KEY}`
      );
      const j = await r.json();
      const receipt = j?.result;
      if (!receipt) return null;

      const gasUsed = BigInt(receipt.gasUsed); // hex string -> BigInt
      let gasPriceWei = null;

      if (receipt.effectiveGasPrice) {
        gasPriceWei = BigInt(receipt.effectiveGasPrice);
      } else {
        // fallback: fetch tx to get gasPrice
        const t = await fetch(
          `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}&apikey=${ETHERSCAN_API_KEY}`
        );
        const tj = await t.json();
        if (tj?.result?.gasPrice) gasPriceWei = BigInt(tj.result.gasPrice);
      }
      if (!gasPriceWei) return null;

      const wei = gasUsed * gasPriceWei;
      const eth = Number(wei) / 1e18;
      return eth;
    } catch (e) {
      console.error("fetchTxCostEth error:", e);
      return null;
    }
  };

  // Compute the 3 card totals (actuals + estimate for pending)
  const recomputeCardGas = async () => {
    const accepted = accessRequests.filter(r => r.status === 'Accepted');
    const declined = accessRequests.filter(r => r.status === 'Declined');
    const pending = accessRequests.filter(r => r.status === 'Pending');

    // Sum actual costs for any with txHash
    const sumCosts = async (arr) => {
      let total = 0;
      for (const r of arr) {
        if (r.txHash) {
          const c = await fetchTxCostEth(r.txHash);
          if (c != null) total += c;
        }
      }
      return total;
    };

    const [acceptedEth, declinedEth] = await Promise.all([
      sumCosts(accepted),
      sumCosts(declined),
    ]);

    // Estimate cost to process all pending using current Propose gas price
    let pendingEstEth = 0;
    if (gasBands.propose) {
      const perTx = (EST_GAS_UNITS * gasBands.propose) / 1e9; // gwei -> eth
      pendingEstEth = pending.length * perTx;
    }

    setCardGas({ acceptedEth, declinedEth, pendingEstEth });
  };

  useEffect(() => {
    fetchGasAndPrice();
  }, []);

  useEffect(() => {
    // recompute when requests or gas price band changes
    recomputeCardGas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessRequests, gasBands.propose]);

  const refreshGasFee = async () => {
    await fetchGasAndPrice();
    await recomputeCardGas();
  };

  const getGasStatusClass = () => {
    if (gasPrice.includes("Error")) return "high-fee";
    const gwei = parseInt(gasPrice);
    if (gwei < 20) return "low-fee";
    if (gwei > 50) return "high-fee";
    return "medium-fee";
  };

  // ---- UI helpers & actions ----
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

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

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

  const navItemClass = (value) => `nav-item ${section === value ? 'selected' : ''}`;
  const getStatusColor = (status) => (status === 'Accepted' ? 'green' : status === 'Declined' ? 'red' : 'orange');

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

      <main className={`main-content ${isSidebarOpen ? 'shifted' : ''}`}>
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
                    <th>Gas Fee</th>
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
                      <td>{req.gasFee}</td>
                      <td style={{ color: getStatusColor(req.status), fontWeight: 'bold' }}>{req.status}</td>
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
            <Chat userRole="patient" userId="patient123" />
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

            {/* Stats Section */}
            <div className="dicom-stats">
              <div className="dicom-stat-card">
                <h3>No. of Request <span style={{ color: 'green' }}>Accepted</span></h3>
                <p className="stat-value">
                  {accessRequests.filter(req => req.status === 'Accepted').length}
                </p>
                <div className="gas-fee-mini">
                  <strong>Gas Used:</strong> {formatEthUsd(cardGas.acceptedEth)}
                </div>
                <button className="dicom-stat-button">View</button>
              </div>

              <div className="dicom-stat-card">
                <h3>No. of Request <span style={{ color: 'red' }}>Declined</span></h3>
                <p className="stat-value">
                  {accessRequests.filter(req => req.status === 'Declined').length}
                </p>
                <div className="gas-fee-mini">
                  <strong>Gas Used:</strong> {formatEthUsd(cardGas.declinedEth)}
                </div>
                <button className="dicom-stat-button">View</button>
              </div>

              <div className="dicom-stat-card">
                <h3>No. of Request <span style={{ color: 'orange' }}>Pending</span></h3>
                <p className="stat-value">
                  {accessRequests.filter(req => req.status === 'Pending').length}
                </p>
                <div className="gas-fee-mini">
                  <strong>Est. To Process:</strong> {formatEthUsd(cardGas.pendingEstEth)}
                </div>
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
                </div>

                <div className={`gas-status ${getGasStatusClass()}`}>
                  Status: {gasStatus}
                </div>
                <div className="gas-updated">Updated: {lastUpdated}</div>
              </div>
            </div>

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
