import React, { useState, useRef } from 'react';
import './Dashboard.css';
import { MdEdit } from "react-icons/md";

function ProfileSettings({ name, uniqueId, role = 'Patient' }) {
  const [fullName, setFullName] = useState(name);
  const [contact, setContact] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(false);

  const fileInputRef = useRef(null);

  // Trigger hidden file input when icon is clicked
  const handleEditPhotoClick = () => {
    fileInputRef.current.click();
  };

  // Handle selected file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG or PNG).');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result); // Preview the image
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile-settings-wrapper">
      {/* Profile Header */}
      <div className="profile-settings-container">
        {/* Name Section */}
        <div className="name-section">
          <h2
            className="admin-name"
            onClick={() => {
              const newName = prompt('Enter your name:', fullName);
              if (newName) setFullName(newName);
            }}
          >
            {fullName}
          </h2>
          <p className="role-text">{role} ID: {uniqueId}</p>
        </div>

        {/* Profile Image */}
        <div className="profile-image-container">
          {profilePhoto ? (
            <img src={profilePhoto} alt="Profile" className="profile-image" />
          ) : (
            <div className="no-image-placeholder">No Image</div>
          )}

          {/* Hidden File Input */}
          <input
            type="file"
            accept="image/jpeg, image/png"
            ref={fileInputRef}
            className="hidden-file-input"
            onChange={handleFileChange}
          />

          {/* Edit Icon Overlay */}
          <div className="edit-icon" onClick={handleEditPhotoClick}>
            <MdEdit size={18} />
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="profile-form">
        {/* Basic Info */}
        <section>
          <label>Full Name:</label><br />
          <input
            type="text"
            className="name-input"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          /><br />

          <label>Date of Birth:</label><br />
          <input type="date" /><br />

          <label>Contact Number:</label><br />
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          /><br />
        </section>

        {/* Security */}
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

        {/* Communication Preferences */}
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

        {/* Delete Account */}
        <section>
          <h4>Account</h4>
          <button className="delete-account-btn">
            Request Account Deletion
          </button>
        </section>

        {/* Save / Cancel */}
        <section className="action-buttons">
          <button
            className="save-btn"
            onClick={() => alert('Profile saved!')}
          >
            Save Changes
          </button>
          <button
            className="cancel-btn"
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
    </div>
  );
}

export default ProfileSettings;
