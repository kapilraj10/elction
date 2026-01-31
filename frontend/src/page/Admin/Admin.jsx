import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./Admin.css";

const Admin = () => {
  const navigate = useNavigate();
  const adminName = "Admin"; 

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");


    navigate("/login");
  };
  const getGreeting = () => {
    const hour = new Date().getHours();
    if ( hour >= 5  && hour < 12){
        return "Good Morining";
    } else if (hour >= 12 && hour < 17){
        return "Good Afternoon";
    } else if (hour >= 17 && hour < 21){
        return "Good Evening";
    } else {
        return "Good Night";
    }
  }

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <h2>Admin Panel</h2>

        <ul>
            <li>
                <Link to="/admin/dashboard">Dashboard</Link>
            </li>
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
          <h3>Hello,{adminName}  {getGreeting()}  </h3>
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
