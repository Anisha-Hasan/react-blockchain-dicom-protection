import React from 'react';

function StaffLogin() {
  return (
    <div className="container mt-5">
      <h2 className="mb-4">Staff Login</h2>
      <form>
        <div className="mb-3">
          <label>Staff ID</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter your Patient ID"
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
}

export default StaffLogin;
