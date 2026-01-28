import React from "react";
import "./Navbar.css";

const Navbar = ({ view, setView }) => {
  const handleNav = (e, v) => {
    e.preventDefault();
    if (setView) setView(v);
  };

  return (
    <nav className="navbar navbar-expand-lg nc-navbar">
      <div className="container-fluid px-4">
        {/* Logo + Name */}
        <a
          className="navbar-brand d-flex align-items-center gap-2"
          href="#"
        >
          <div className="nc-logo">🌳</div>
          <div className="brand-text">
            <span className="brand-name">केश बहादुर बिष्ट</span>
            <small className="brand-sub">नेपाली कांग्रेस</small>
          </div>
        </a>

        {/* Mobile toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav links */}
        <div className="collapse navbar-collapse" id="navContent">
          {/* Center links - cleaned (removed home) */}
          <ul className="navbar-nav mx-auto">
            {[
              ["about", "हाम्रो बारे"],
              ["commitment", "प्रतिबद्धता"],
              ["suggestion", "सुझाव"],
            ].map(([key, label]) => (
              <li className="nav-item" key={key}>
                <button
                  className={`nav-link nc-link ${view === key ? "active" : ""}`}
                  onClick={(e) => handleNav(e, key)}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
