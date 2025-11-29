import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">HealthAdmin Lite</Link>
      </div>
      <ul className="navbar-menu">
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/pacientes">Pacientes</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;