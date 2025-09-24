import React, { useState, useEffect } from "react";
import axios from "axios";
import './Logs.css';

function TagPatDoc() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [patientQuery, setPatientQuery] = useState("");
  const [doctorQuery, setDoctorQuery] = useState("");

  const [filteredPatients, setFilteredPatients] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [message, setMessage] = useState("");

  // Helper getters
  const getPatientId = (p) => p?.patientID ?? p?.patientId ?? p?._id ?? "";
  const getPatientName = (p) => p?.patientName ?? p?.fullName ?? p?.username ?? "";
  const getDoctorId = (d) => d?._id ?? "";
  const getDoctorName = (d) => d?.username ?? d?.fullName ?? d?.name ?? "";

  // Fetch patients and doctors
  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientsRes = await axios.get("http://localhost:4000/api/patients");
        const doctorsRes = await axios.get("http://localhost:4000/api/doctors");
        console.log("Patients:", patientsRes.data);
        console.log("Doctors:", doctorsRes.data);
        setPatients(patientsRes.data || []);
        setDoctors(doctorsRes.data || []);
      } catch (error) {
        console.error("Error fetching patients/doctors", error);
        setMessage("❌ Error fetching patients or doctors (check backend)");
      }
    };
    fetchData();
  }, []);

  // Filter patients
  useEffect(() => {
    const q = patientQuery.trim().toLowerCase();
    if (!q) return setFilteredPatients([]);
    setFilteredPatients(
      patients.filter((p) => {
        const id = getPatientId(p).toLowerCase();
        const name = getPatientName(p).toLowerCase();
        return id.includes(q) || name.includes(q);
      })
    );
  }, [patientQuery, patients]);

  // Filter doctors
  useEffect(() => {
    const q = doctorQuery.trim().toLowerCase();
    if (!q) return setFilteredDoctors([]);
    setFilteredDoctors(
      doctors.filter((d) => {
        const name = getDoctorName(d).toLowerCase();
        return name.includes(q);
      })
    );
  }, [doctorQuery, doctors]);

  // Extract ID from "ID - Name" text
  const extractIdFromQuery = (text) => {
    if (!text) return "";
    const parts = text.split(" - ");
    return parts[0].trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const patientId = selectedPatient
      ? getPatientId(selectedPatient)
      : extractIdFromQuery(patientQuery) || patientQuery.trim();

    const doctorId = selectedDoctor
      ? getDoctorId(selectedDoctor)
      : extractIdFromQuery(doctorQuery) || doctorQuery.trim();

    if (!patientId || !doctorId) {
      setMessage("⚠️ Please select or type both patient and doctor IDs");
      return;
    }

    try {
      const res = await axios.post("http://localhost:4000/api/tag-patient-doctor", {
        patientId,
        doctorId,
      });

      if (res.status === 200 || res.status === 201) {
        setMessage("✅ Patient successfully tagged to doctor");
        setPatientQuery("");
        setDoctorQuery("");
        setSelectedPatient(null);
        setSelectedDoctor(null);
        setFilteredPatients([]);
        setFilteredDoctors([]);
        const patientsRes = await axios.get("http://localhost:4000/api/patients");
        setPatients(patientsRes.data || []);
      } else {
        setMessage("❌ Failed to tag patient (server returned an error)");
      }
    } catch (error) {
      console.error("Error tagging patient to doctor", error);
      const serverMsg = error?.response?.data?.message;
      setMessage(serverMsg ? `❌ ${serverMsg}` : "❌ Failed to tag patient");
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Tag Patient to Doctor</h3>
      <form onSubmit={handleSubmit} className="p-3 border rounded bg-dark text-light">

        {/* Patient Auto-complete */}
        <div className="mb-3 position-relative">
          <label className="form-label">Enter Patient ID or Name</label>
          <input
            type="text"
            className="form-control custom-input"
            value={patientQuery}
            onChange={(e) => {
              setPatientQuery(e.target.value);
              setSelectedPatient(null);
            }}
            placeholder="Type Patient ID or Name..."
            autoComplete="off"
          />
          {filteredPatients.length > 0 && (
            <ul className="list-group position-absolute w-100" style={{ zIndex: 1000 }}>
              {filteredPatients.map((p) => (
                <li
                  key={p._id ?? getPatientId(p)}
                  className="list-group-item list-group-item-action"
                  onClick={() => {
                    setSelectedPatient(p);
                    setPatientQuery(`${getPatientId(p)} - ${getPatientName(p)}`);
                    setFilteredPatients([]);
                  }}
                >
                  {getPatientId(p)} - {getPatientName(p)}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Doctor Auto-complete */}
        <div className="mb-3 position-relative">
          <label className="form-label">Enter Doctor Name</label>
          <input
            type="text"
            className="form-control custom-input"
            value={doctorQuery}
            onChange={(e) => {
              setDoctorQuery(e.target.value);
              setSelectedDoctor(null);
            }}
            placeholder="Type Doctor Name..."
            autoComplete="off"
          />
          {filteredDoctors.length > 0 && (
            <ul className="list-group position-absolute w-100" style={{ zIndex: 1000 }}>
              {filteredDoctors.map((d) => (
                <li
                  key={d._id}
                  className="list-group-item list-group-item-action"
                  onClick={() => {
                    setSelectedDoctor(d);
                    setDoctorQuery(d.username);
                    setFilteredDoctors([]);
                  }}
                >
                  {d.username}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button type="submit" className="btn btn-success">
          Tag Patient
        </button>
      </form>

      {message && <p className="mt-3">{message}</p>}
    </div>
  );
}

export default TagPatDoc;
