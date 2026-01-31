import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./Admin.css";

const Admin = () => {
  const navigate = useNavigate();
  const adminName = "Admin"; // you can replace this dynamically later

  const handleLogout = () => {
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
            <Link to="/admin/suggestions">Suggestions</Link>
          </li>
          <li>
            <Link to="/admin/commitments">Commitments</Link>
          </li>
          <li>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="admin-content-wrapper">
        {/* Top Navbar */}
        <div className="admin-topbar">
          <h3>Hello, Good Morning {adminName} </h3>
        </div>

        {/* Dynamic Content */}
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Admin;
