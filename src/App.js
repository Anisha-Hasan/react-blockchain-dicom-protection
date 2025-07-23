import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import PatientLogin from './components/PatientLogin';
import DoctorLogin from './components/DoctorLogin';
import StaffLogin from './components/StaffLogin';
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import StaffDashboard from './components/StaffDashboard'; 

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/patient-login" element={<PatientLogin />} />
      <Route path="/doctor-login" element={<DoctorLogin />} />
      <Route path="/staff-login" element={<StaffLogin />} />
      <Route path="/patient-dashboard" element={<PatientDashboard />} />
      <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
      <Route path="/staff-dashboard" element={<StaffDashboard />} />
    </Routes>
  );
}

export default App;
