import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./Admin.css"; // create this file for styling

const Admin = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // clear token or user data if you have any
    // localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <h2>Admin Panel</h2>

        <ul>
          <li>
            <Link to="/suggestions">Suggestions</Link>
          </li>
          <li>
            <Link to="/commitment">Commitments</Link>
          </li>
          <li>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;
