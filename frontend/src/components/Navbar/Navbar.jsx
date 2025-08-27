import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import useAuth from '../../hooks/useAuth.js';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const onLogout = () => {
    logout();
    navigate('/');
  };
  return (
    <nav className="navbar">
      <div className="nav-inner container">
        <Link to="/" className="brand">SocialApp</Link>
        <div className="nav-links">
          <Link to="/posts">Explore</Link>
          {user ? (
            <>
              <Link to="/profile">Profile</Link>
              <button className="btn secondary" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


