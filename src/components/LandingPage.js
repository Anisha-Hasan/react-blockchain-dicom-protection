import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div className="hero-container">
        <div className="hero-content">
          <h1>Blockchain DICOM Protection System</h1>
          <p>Secure. Decentralized. Patient-Controlled Medical Image Access.</p>

          <div className="hero-buttons">
            <Link to="/patient-login">
              <button className="btn btn-primary btn-lg">Login as Patient</button>
            </Link>
            <Link to="/doctor-login">
              <button className="btn btn-success btn-lg">Login as Doctor</button>
            </Link>
            <Link to="/staff-login">
              <button className="btn btn-dark btn-lg">Login as Admin</button>
            </Link>
          </div>
        </div>

        
      </div>

      {/* Footer Section */}
      <footer className="landing-footer">
        <div className="footer-compliance">
          <span>Compliant with:</span>
          <div className="compliance-badges">
            <img src="/icons/hipaa-badge.svg" alt="HIPAA Compliant" />
            <img src="/icons/gdpr-badge.svg" alt="GDPR Compliant" />
          </div>
        </div>

        <div className="footer-links">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/contact">Contact Us</Link>
        </div>

        <div className="footer-powered-by">
          <span>Powered by:</span>
          <div className="tech-logos">
            <img src="/icons/ethereum-logo.svg" alt="Ethereum" />
            <img src="/icons/ipfs-logo.svg" alt="IPFS" />
          </div>
        </div>

        <div className="footer-copyright">
          &copy; {new Date().getFullYear()} Blockchain DICOM Protection System. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
