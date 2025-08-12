import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const userData = JSON.parse(localStorage.getItem('userData'))
  const username = userData.username
  const navigate = useNavigate()

  const onLogout = () => {
    localStorage.clear('userData')
    navigate('/')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm px-4">
      <a className="navbar-brand fw-bold" href="#">
        {userData.role.toUpperCase()}
      </a>
      <div className="ms-auto d-flex align-items-center gap-3">
        <span className="fw-semibold text-primary">Welcome, {username}</span>
        <button onClick={onLogout} className="btn btn-outline-danger btn-sm">
          Logout
        </button>
      </div>
    </nav>
  );
};
