import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

export const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate()

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    const isLoggedIn = userData && JSON.parse(userData)?.token;

    if (isLoggedIn) {
      navigate(-1);
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {
      toast.error('All fields are required!');
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, { email, password }, { withCredentials: true });

      toast.success('Login successful!');
      // alert("Success")

      localStorage.setItem('userData', JSON.stringify(res.data.user))

      navigate('/dashboard')
    } catch (err) {
      console.error("Error:", err);
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Server error. Failed to login.');
      }
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '450px' }}>
      <div className="card shadow">
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Login</h3>
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                autoComplete="off"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control"
                autoComplete="off"
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
            <div className="text-center">
              Don't have account ?
              <Link to="/registration">Register</Link>
            </div>
          </form>
        </div>
      </div>

      <ToastContainer position="top-right" />
    </div>
  );
};
