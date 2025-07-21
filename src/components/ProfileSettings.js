import React, { useState } from 'react';
import './Dashboard.css';

function ProfileSettings({ name, uniqueId, role = 'Patient' }) {
  const [fullName, setFullName] = useState(name);
  const [contact, setContact] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(false);

  return (
    <div>
      <h2>Profile Settings</h2>

      {/* 1️⃣ Upload / Preview Profile Photo */}
      <section>
        <h4>Profile Photo</h4>
        {profilePhoto && <img src={profilePhoto} alt="Profile" style={{ width: '100px', borderRadius: '50%' }} />}
        <input
          type="text"
          placeholder="Image URL"
          value={profilePhoto}
          onChange={(e) => setProfilePhoto(e.target.value)}
        />
        <p style={{ fontSize: '0.9rem' }}>Tip: Use an avatar/cartoon link if you prefer not to upload a real photo.</p>
      </section>

      {/* 2️⃣ Basic Info */}
      <section>
        <h4>Basic Info</h4>
        <label>Full Name:</label><br />
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        /><br />

        <label>{role} ID:</label><br />
        <input type="text" value={uniqueId} readOnly /><br />

        <label>Date of Birth:</label><br />
        <input type="date" /><br />

        <label>Contact Number:</label><br />
        <input
          type="text"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        /><br />
      </section>

      {/* 3️⃣ Security */}
      <section>
        <h4>Security</h4>
        <label>New Password:</label><br />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        /><br />

        <label>
          <input type="checkbox" disabled /> Enable Two-Factor Authentication (Coming Soon)
        </label>
      </section>

      {/* 4️⃣ Communication Preferences */}
      <section>
        <h4>Communication Preferences</h4>
        <label>
          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={(e) => setEmailNotifications(e.target.checked)}
          /> Receive email/text notifications
        </label>
      </section>

      {/* 5️⃣ Delete / Deactivate */}
      <section>
        <h4>Account</h4>
        <button style={{ background: 'red', color: '#fff', border: 'none', padding: '5px 10px' }}>
          Request Account Deletion
        </button>
      </section>

      {/* 6️⃣ Save & Cancel */}
      <section style={{ marginTop: '20px' }}>
        <button
          onClick={() => alert('Profile saved!')}
          style={{ marginRight: '10px' }}
        >
          Save Changes
        </button>
        <button
          onClick={() => {
            setFullName(name);
            setContact('');
            setProfilePhoto('');
            setNewPassword('');
            setEmailNotifications(false);
          }}
        >
          Cancel
        </button>
      </section>
    </div>
  );
}

export default ProfileSettings;
