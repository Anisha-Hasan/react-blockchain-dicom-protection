import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import PatientLogin from './components/PatientLogin';
import DoctorLogin from './components/DoctorLogin';
import AdminLogin from './components/AdminLogin';
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import AdminDashboard from './components/AdminDashboard'; 
import AddPatient from "./components/AddPatient";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/patient-login" element={<PatientLogin />} />
      <Route path="/doctor-login" element={<DoctorLogin />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/patient-dashboard" element={<PatientDashboard />} />
      <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/add-patient" element={<AddPatient />} />
    </Routes>
  );
}

export default App;
