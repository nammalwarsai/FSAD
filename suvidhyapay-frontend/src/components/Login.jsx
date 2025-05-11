import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Turnstile } from "@marsidev/react-turnstile";
import Swal from "sweetalert2";
import api from '../utils/axiosConfig';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await api.post('/api/users/login', {
        emailid: formData.email,
        password: formData.password
      });      if (response.data && response.data.userId) {
        // Store user data directly in localStorage
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('userEmail', response.data.emailid);
        localStorage.setItem('userName', response.data.name);
        
        // Show success message
        await Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: 'Welcome to SuvidhaPay!',
          timer: 1500,
          showConfirmButton: false
        });
        
        // Navigate directly to dashboard
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.response?.data?.error || 'An error occurred during login'
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-200 to-indigo-200">
      <div className="w-96 rounded-3xl shadow-lg p-8 bg-white">
        <Link
          to="/"
          className="mb-6 inline-flex items-center px-4 py-2 rounded-lg transition-colors bg-gray-100 hover:bg-gray-200 text-gray-700"
        >
          <span className="mr-2">←</span> Back to Home
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">
            SuvidhaPay
          </h1>
          <p className="text-sm text-gray-600">
            Your All-in-One Banking Solution
          </p>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Welcome Back!
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg transition-colors bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-400 text-gray-900"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg transition-colors bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-400 text-gray-900"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex justify-center">
              <Turnstile siteKey={siteKey} />
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-lg text-white font-medium transition-colors bg-blue-600 hover:bg-blue-700"
            >
              Log In
            </button>
          </div>
        </form>

        <p className="text-center mt-4 text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline font-medium">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
