import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import PatientLogin from './components/PatientLogin';
import StaffLogin from './components/StaffLogin';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/patient-login" element={<PatientLogin />} />
      <Route path="/staff-login" element={<StaffLogin />} />
    </Routes>
  );
}

export default App;
