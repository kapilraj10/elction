import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./Admin.css";

const Admin = () => {
    const navigate = useNavigate();
    const adminName = "Admin";

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        navigate("/login", { replace: true });
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return "Good Morning";
        if (hour >= 12 && hour < 17) return "Good Afternoon";
        if (hour >= 17 && hour < 21) return "Good Evening";
        return "Good Night";
    };

    return (
        <div className="admin-wrapper">
            {/* Top Navigation Bar */}
            <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm fixed-top">
                <div className="container-fluid">
                    {/* Left Side */}
                    <div className="d-flex align-items-center">
                        <span className="navbar-brand fw-bold text-primary">
                            Admin<span className="text-dark">Panel</span>
                        </span>
                    </div>

                    {/* Right Side */}
                    <div className="d-flex align-items-center ms-auto">
                        <div className="me-3 muted">{getGreeting()}</div>
                        <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </nav>

            {/* Sidebar & Main Content */}
            <div className="container-fluid mt-5 pt-3">
                <div className="row">
                    {/* Sidebar */}
                    <div className="col-md-3 col-lg-2 px-0"
                        style={{ minHeight: 'calc(100vh - 73px)' }}>
                        <div className="bg-white border-end h-100 p-3 shadow-sm">
                            {/* User info removed per request */}

                            {/* Navigation */}
                            <nav className="nav flex-column">

                                <NavLink
                                    to="dashboard"
                                    className={({ isActive }) =>
                                        `nav-link d-flex align-items-center mb-2 rounded ${isActive ? 'active bg-primary text-white' : 'text-dark'}`
                                    }
                                >
                                    <span className="me-2"></span>
                                    Dashboard
                                </NavLink>

                                <NavLink
                                    to="suggestions"
                                    className={({ isActive }) =>
                                        `nav-link d-flex align-items-center mb-2 rounded ${isActive ? 'active bg-primary text-white' : 'text-dark'}`
                                    }
                                >
                                    <span className="me-2"></span>
                                    Suggestions

                                </NavLink>

                                <NavLink
                                    to="commitments"
                                    className={({ isActive }) =>
                                        `nav-link d-flex align-items-center mb-2 rounded ${isActive ? 'active bg-primary text-white' : 'text-dark'}`
                                    }
                                >
                                    <span className="me-2"></span>
                                    Commitment
                                </NavLink>

                                <NavLink
                                    to="posts"
                                    className={({ isActive }) =>
                                        `nav-link d-flex align-items-center mb-2 rounded ${isActive ? 'active bg-primary text-white' : 'text-dark'}`
                                    }
                                >
                                    <span className="me-2"></span>
                                    Posts
                                </NavLink>
                            </nav>



                            {/* Logout Button */}
                            <button
                                className="btn btn-outline-danger w-100 mt-4"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-md-9 col-lg-10">
                        <div className="p-3">
                            {/* Welcome Card */}
                            <div className="card bg-primary text-white mb-4 border-0 shadow">
                                <div className="card-body">
                                    <h4 className="card-title">
                                        {getGreeting()}, {adminName}!
                                    </h4>
                                    <p className="card-text mb-0">
                                        Here's what's happening with your platform today.
                                    </p>
                                </div>
                            </div>

                            {/* (Stats cards removed per request) */}

                            {/* Main Content Area */}
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <Outlet />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;