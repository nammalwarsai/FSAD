import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaMoneyBillWave, FaHistory, FaSpinner, FaDownload, FaTimes } from 'react-icons/fa';
import api from '../utils/axiosConfig';
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';

const RequestLoan = () => {
  const [loanAmount, setLoanAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [loading, setLoading] = useState(false);
  const [existingRequest, setExistingRequest] = useState(null);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    fetchExistingRequest();
  }, []);

  const fetchExistingRequest = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await api.get(`/api/loans/user/${userId}`);
      if (response.data) {
        setExistingRequest(response.data);
      }
    } catch (error) {
      console.error('Error fetching loan request:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!loanAmount || loanAmount <= 0) {
      toast.error('Please enter a valid loan amount');
      return;
    }

    if (!purpose.trim()) {
      toast.error('Please enter the purpose for your loan');
      return;
    }

    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      const response = await api.post('/api/loans/request', {
        userId,
        amount: loanAmount,
        purpose,
        email: userEmail
      });

      if (response.data) {
        await Swal.fire({
          icon: 'success',
          title: 'Loan Request Submitted',
          text: 'Your loan request has been submitted successfully!',
          timer: 2000,
          showConfirmButton: false
        });
        setLoanAmount('');
        setPurpose('');
        fetchExistingRequest();
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Request Failed',
        text: error.response?.data?.error || 'Failed to submit loan request'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelLoan = async () => {
    try {
      const result = await Swal.fire({
        title: 'Cancel Loan Request',
        text: 'Are you sure you want to cancel your loan request?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, cancel it',
        cancelButtonText: 'No, keep it'
      });

      if (result.isConfirmed && existingRequest) {
        const response = await api.delete(`/api/loans/cancel/${existingRequest.id}`);
        
        if (response.data) {
          toast.success('Loan request cancelled successfully');
          setExistingRequest(null);
        }
      }
    } catch (error) {
      console.error('Error cancelling loan:', error);
      toast.error(error.response?.data?.error || 'Failed to cancel loan request');
    }
  };

  const downloadStatement = () => {
    if (!existingRequest) return;

    const statement = `
SUVIDHAPAY LOAN REQUEST STATEMENT
----------------------------------
Request ID: ${existingRequest.id}
Date: ${new Date(existingRequest.requestDate).toLocaleDateString('en-IN')}
Time: ${new Date(existingRequest.requestDate).toLocaleTimeString('en-IN')}

DETAILS
----------------------------------
Amount Requested: ₹${Number(existingRequest.amount).toLocaleString('en-IN')}
Status: ${existingRequest.status || 'Pending'}
Purpose: ${existingRequest.purpose}
Email: ${existingRequest.email}

This is an automatically generated statement.
For any queries, please contact SuvidhaPay support.
    `.trim();

    const blob = new Blob([statement], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `loan-request-${existingRequest.id}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  if (existingRequest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHistory className="text-blue-600 text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Existing Loan Request</h2>
            </div>

            <div className="space-y-4 text-gray-600">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium text-gray-700">Amount Requested</p>
                <p className="text-2xl font-bold text-blue-600">₹{Number(existingRequest.amount).toLocaleString('en-IN')}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium text-gray-700">Purpose</p>
                <p>{existingRequest.purpose}</p>
              </div>              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium text-gray-700">Status</p>
                <p className="capitalize">{existingRequest.status || 'Pending'}</p>
              </div>

              <div className="mt-6 space-y-3">
                <motion.button
                  onClick={downloadStatement}
                  className="w-full flex items-center justify-center px-4 py-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaDownload className="mr-2" />
                  Download Statement
                </motion.button>

                {existingRequest.status === 'PENDING' && (
                  <motion.button
                    onClick={handleCancelLoan}
                    className="w-full flex items-center justify-center px-4 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaTimes className="mr-2" />
                    Cancel Loan Request
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaMoneyBillWave className="text-blue-600 text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Request a Loan</h2>
            <p className="text-gray-600 mt-2">Fill out the form below to submit your loan request</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loan Amount (₹)
              </label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                placeholder="Enter amount in INR"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purpose of Loan
              </label>
              <textarea
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Briefly describe why you need this loan"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="4"
                required
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 rounded-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 flex items-center justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                'Submit Loan Request'
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default RequestLoan;
