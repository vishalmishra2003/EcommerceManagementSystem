import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export const Registration = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (!formData.role) {
      toast.error('Please select a role');
      return;
    }

    try {
      console.log(formData)
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/register`, // make sure backend route is correct
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role
        },
        {
          withCredentials: true
        }
      );

      if (res.data) {
        toast.success('Registration successful!');
        setTimeout(() => navigate('/'), 2000); // Redirect to login after 2 sec
      }
    } catch (error) {
      console.error("Registration error:", error);
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
    }

    // Optional: clear form even on error
    setFormData({
      username: '',
      email: '',
      password: '',
      role: ''
    });
  };

  return (
    <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-light px-3">
      <ToastContainer position="top-center" theme="colored" />
      <div className="card p-4 shadow-sm w-100" style={{ maxWidth: '700px' }}>
        <h3 className="text-center mb-4">Create Account</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your username"
              autoComplete="off"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your email"
              autoComplete="off"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your password"
              autoComplete="off"
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">-- Select Role --</option>
              <option value="admin">Admin</option>
              <option value="customer">Customer</option>
              <option value="delivery_partner">Delivery Partner</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>

          <div className="text-center mt-3">
            Have an account? <Link to="/">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};
