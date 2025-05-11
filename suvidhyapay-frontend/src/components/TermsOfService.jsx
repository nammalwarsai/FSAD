import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-indigo-200">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8"
        >
          <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">Terms of Service</h1>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
              <p className="text-gray-600">By accessing or using SuvidhaPay's services, you agree to be bound by these terms and conditions. Our platform provides banking and expense tracking services.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">User Responsibilities</h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Provide accurate information for all banking transactions</li>
                <li>Maintain security of account credentials</li>
                <li>Report any unauthorized access immediately</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Money Transfer & Transactions</h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>All payments are processed through Razorpay</li>
                <li>Transaction times may vary based on banking partners</li>
                <li>Users are responsible for providing correct recipient information</li>
              </ul>
            </section>

            <div className="mt-12 text-center">
              <button
                onClick={() => navigate('/')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;