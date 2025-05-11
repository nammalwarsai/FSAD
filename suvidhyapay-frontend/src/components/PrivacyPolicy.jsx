import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
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
          <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">Privacy Policy</h1>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
              <p className="text-gray-600">Welcome to SuvidhaPay's Privacy Policy. This policy explains how we collect, use, and protect your personal information when you use our online banking and expense tracking system.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">What Data We Collect</h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Personal Information: Name, email, phone number, address</li>
                <li>Banking Information: Bank account details for transactions</li>
                <li>Transaction Data: Records of money transfers</li>
                <li>Authentication Data: Information from Google, GitHub, LinkedIn</li>
                <li>Device & Usage Data: IP address, browser type, access logs</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">How We Use Your Data</h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Processing bank transfers and payments</li>
                <li>Tracking expenses and providing financial insights</li>
                <li>User authentication and login</li>
                <li>Improving security and fraud detection</li>
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

export default PrivacyPolicy;