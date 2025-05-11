import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Turnstile } from "@marsidev/react-turnstile";
import api from '../utils/axiosConfig';
import Swal from 'sweetalert2';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    password: '',
    phoneNumber: '', 
    address: '',
    dob: '',
    emailid: '',
    aadharnumber: '',
    pannumber: '',
    bank_name: '',
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
      const response = await api.post('/api/users/register', {
        username: formData.username,
        fullName: formData.fullName,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        address: formData.address || '',
        dob: formData.dob,
        emailid: formData.emailid,
        aadharnumber: formData.aadharnumber,
        pannumber: formData.pannumber,
        bank_name: formData.bank_name || '',
        balance: 0
      });

      if (response.data) {
        await Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          text: 'Please login to continue',
          timer: 2000,
          showConfirmButton: false
        });
        navigate('/login');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: error.response?.data?.error || 'An error occurred during registration'
      });
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl transition-all duration-200 bg-gray-50 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-gray-900 text-base placeholder-gray-400 shadow-sm hover:border-gray-300";
  const labelClass = "block text-sm font-semibold mb-2 text-gray-700";
  const buttonClass = "w-full py-3 px-6 rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 font-medium text-base";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full mx-4 rounded-3xl shadow-xl p-8 bg-white/95 backdrop-blur-sm border border-gray-100">
        <Link
          to="/"
          className="mb-8 inline-flex items-center px-4 py-2 rounded-xl transition-all duration-200 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium text-sm border border-gray-200 hover:border-gray-300 shadow-sm"
        >
          <span className="mr-2">←</span> Back to Home
        </Link>

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3 text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            SuvidhaPay
          </h1>
          <p className="text-base text-gray-600">
            Your All-in-One Banking Solution
          </p>
        </div>

        <h2 className="text-2xl font-bold mb-8 text-gray-800 border-b pb-4">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className={labelClass}>Username</label>
            <input 
              type="text" 
              name="username"
              value={formData.username}
              onChange={handleChange}
              required 
              className={inputClass}
              placeholder="Enter username"
            />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Full Name</label>
            <input 
              type="text" 
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required 
              className={inputClass}
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-1">
            <label className={labelClass}>Date of Birth</label>
            <input 
              type="date" 
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required 
              className={inputClass}
            />
          </div>

          <div className="space-y-1">
            <label className={labelClass}>Email Address</label>
            <input 
              type="email" 
              name="emailid"
              value={formData.emailid}
              onChange={handleChange}
              required 
              className={inputClass}
              placeholder="your.email@example.com"
            />
          </div>

          <div className="space-y-1">
            <label className={labelClass}>Phone Number</label>
            <input 
              type="tel" 
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required 
              pattern="[0-9]{10}" 
              className={inputClass}
              placeholder="Enter 10-digit phone number"
            />
          </div>

          <div className="space-y-1">
            <label className={labelClass}>Password</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              required 
              className={inputClass}
              placeholder="Create a strong password"
            />
          </div>

          <div className="space-y-1">
            <label className={labelClass}>Aadhaar Number</label>
            <input 
              type="text" 
              name="aadharnumber"
              value={formData.aadharnumber}
              onChange={handleChange}
              required 
              pattern="[0-9]{12}"
              className={inputClass}
              placeholder="Enter 12-digit Aadhaar number"
            />
          </div>

          <div className="space-y-1">
            <label className={labelClass}>PAN Number</label>
            <input 
              type="text" 
              name="pannumber"
              value={formData.pannumber}
              onChange={handleChange}
              required 
              className={inputClass}
              placeholder="Enter your PAN number"
            />
          </div>

          <div className="space-y-1">
            <label className={labelClass}>Address</label>
            <input 
              type="text" 
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={inputClass}
              placeholder="Enter your address"
            />
          </div>

          <div className="space-y-1">
            <label className={labelClass}>Bank Name</label>
            <input 
              type="text" 
              name="bank_name"
              value={formData.bank_name}
              onChange={handleChange}
              className={inputClass}
              placeholder="Enter your bank name"
            />
          </div>

          <div className="col-span-2 flex justify-center my-4">
            <Turnstile siteKey={siteKey} />
          </div>

          <button
            type="submit"
            className={`col-span-2 ${buttonClass}`}
          >
            Create Account
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-700 hover:underline font-semibold transition-colors duration-200"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;