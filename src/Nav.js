import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './css/nav.css';

const Nav = ({ username, role }) => {
  const navigate = useNavigate(); // Use useNavigate to programmatically navigate

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('role');

    // Redirect to login page
    navigate('/login');
  };

  return (
    <header className="nav-header">
    
      <div className="nav-bottom">
        <div className="container">
          <a href="#" className="nav-logo">MedReady</a>
          <nav className="nav-navbar">
            <ul className="nav-navbar-list">
              <li><Link to="/" className="nav-navbar-link">Home</Link></li>
              <li><Link to="/hospitals" className="nav-navbar-link">Hospitals</Link></li>
              <li><Link to="/donors" className="nav-navbar-link">Find donor</Link></li>
              
              <li><Link to="/donorform" className="nav-navbar-link">Become Donor</Link></li>
              <li><Link to="/contact" className="nav-navbar-link">Contact</Link></li>
              <li>
                {role === 'admin' ? (<>
                    <Link to="/contactlist" className="nav-navbar-link">Queries</Link>
                  </>
                ) : (
                  role === 'patient' ?(<li><Link to="/patientprofile" className="nav-navbar-link">Profile</Link></li>)
                    :(<li><Link to="/hospitalprofile" className="nav-navbar-link">Profile</Link></li>)
                )}
              </li>
            </ul>
          </nav>
          <div className="nav-user-info">
            {username ? (
              <div className="nav-user">
                <span className="nav-username">{username}</span>
                <span className="nav-role">{role}</span>
                <button onClick={handleLogout} className="nav-btn">Logout</button>
              </div>
            ) : (
              <Link to="/login" className="nav-btn">Login / Register</Link> 
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Nav;
