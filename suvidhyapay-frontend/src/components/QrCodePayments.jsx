import React, { useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import { Turnstile } from '@marsidev/react-turnstile';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FaDownload, FaPhoneAlt, FaRupeeSign, FaQrcode, FaMobileAlt, FaSave } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import api from '../utils/axiosConfig';

const QrCodePayments = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [provider, setProvider] = useState('');
  const [amount, setAmount] = useState('');
  const [upiLink, setUpiLink] = useState('');
  const [turnstileToken, setTurnstileToken] = useState(null);
  const [showAmountAlert, setShowAmountAlert] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const qrCodeRef = useRef(null);

  const MAX_AMOUNT = 500000;

  const upiProviders = [
    { name: 'PhonePe', suffix: '@ybl' },
    { name: 'Google Pay', suffix: '@okicici' },
    { name: 'Paytm', suffix: '@paytm' },
    { name: 'BHIM', suffix: '@upi' },
  ];

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value > MAX_AMOUNT) {
      setShowAmountAlert(true);
      setAmount(MAX_AMOUNT);
    } else {
      setAmount(value);
    }
  };

  const generateUpiId = () => {
    if (!provider) return '';
    const selectedProvider = upiProviders.find(p => p.name === provider);
    return `${phoneNumber}${selectedProvider.suffix}`;
  };

  const generateQRCode = () => {
    if (!phoneNumber || !provider) {
      alert('Please enter phone number and select a UPI provider');
      return;
    }
    if (phoneNumber.length !== 10) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }
    if (!turnstileToken) {
      alert('Please complete the verification');
      return;
    }

    setIsGenerating(true);

    // Simulate a slight delay for better UX
    setTimeout(() => {
      const upiId = generateUpiId();
      const link = `upi://pay?pa=${upiId}&am=${amount || 0}&cu=INR`;
      setUpiLink(link);
      setIsGenerating(false);
    }, 800);
  };

  const downloadQRCode = async () => {
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Capture QR code section
      const qrCodeElement = qrCodeRef.current;
      const canvas = await html2canvas(qrCodeElement);
      const qrCodeImage = canvas.toDataURL('image/png');

      // PDF styling and content
      pdf.setFillColor(247, 250, 252); // bg-gray-50
      pdf.rect(0, 0, pdf.internal.pageSize.width, pdf.internal.pageSize.height, 'F');

      // Add header
      pdf.setTextColor(30, 64, 175); // blue-800
      pdf.setFontSize(24);
      pdf.text('SuvidhaPay QR Code', 105, 20, { align: 'center' });

      // Add QR code
      const qrCodeWidth = 80;
      const qrCodeHeight = 80;
      const qrCodeX = (pdf.internal.pageSize.width - qrCodeWidth) / 2;
      pdf.addImage(qrCodeImage, 'PNG', qrCodeX, 40, qrCodeWidth, qrCodeHeight);

      // Add transaction details
      pdf.setFontSize(12);
      pdf.setTextColor(31, 41, 55); // gray-800

      const detailsY = 140;
      const details = [
        { label: 'UPI ID:', value: generateUpiId() },
        { label: 'Amount:', value: `₹${Number(amount).toLocaleString('en-IN')}` },
        { label: 'Provider:', value: provider },
        { label: 'Phone Number:', value: phoneNumber },
        { label: 'Generated on:', value: new Date().toLocaleString() },
      ];

      details.forEach((detail, index) => {
        pdf.setFont('helvetica', 'bold');
        pdf.text(40, detailsY + (index * 10), detail.label);
        pdf.setFont('helvetica', 'normal');
        pdf.text(80, detailsY + (index * 10), detail.value);
      });

      // Add footer
      pdf.setFontSize(10);
      pdf.setTextColor(107, 114, 128); // gray-500
      pdf.text('Generated via SuvidhaPay Payment System', 105, 280, { align: 'center' });

      // Save PDF
      const fileName = `SuvidhaPay_QR_${phoneNumber}_${new Date().getTime()}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };
  const saveTransaction = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        toast.error('Please login to save transaction');
        return;
      }

      if (!phoneNumber || !provider || !amount) {
        toast.error('Please fill in all required fields');
        return;
      }

      setIsSaving(true);

      console.log('Saving transaction with data:', {
        userId,
        phoneNumber,
        amount,
        provider
      });

      const response = await api.post('/api/transactions/save', {
        userId: parseInt(userId),
        recipientNumber: phoneNumber,
        amount: parseFloat(amount),
        provider: provider,
        transactionType: 'QR_PAYMENT',
        status: 'COMPLETED',
        upiId: generateUpiId()
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data) {
        toast.success('Transaction saved successfully');
      }    } catch (error) {
      console.error('Error saving transaction:', error);
      if (!error.response) {
        // Network error
        toast.error('Cannot connect to server. Please check if the backend server is running at http://localhost:8080');
        console.error('Network Error Details:', error);
      } else if (error.response?.status === 400) {
        toast.error('Invalid transaction data. Please check your inputs.');
      } else if (error.response?.status === 401) {
        toast.error('Please login again to continue');
        // Redirect to login if unauthorized
        window.location.href = '/login';
      } else if (error.response?.status === 500) {
        toast.error('Server error. Please try again later.');
        console.error('Server Error Details:', error.response.data);
      } else {
        toast.error(error.response?.data?.error || 'Error saving transaction');
        console.error('Other Error Details:', error.response?.data);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 flex items-center justify-center p-4 py-10">
      {/* Amount Alert Modal */}
      <AnimatePresence>
        {showAmountAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl border border-gray-100"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaRupeeSign className="text-red-500 text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Maximum Amount Limit
                </h3>
                <p className="text-gray-600 mb-6">
                  The maximum transaction amount allowed is ₹5,00,000
                </p>
                <button
                  onClick={() => setShowAmountAlert(false)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 transform"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-auto space-y-6 border border-gray-100"
      >
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaQrcode className="text-blue-600 text-3xl" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">UPI QR Code Generator</h1>
          <p className="text-gray-600">Generate QR code for instant UPI payments</p>
        </div>

        <div className="space-y-5">
          {/* Phone Number Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaPhoneAlt className="text-gray-400" />
              </div>
              <input
                type="tel"
                maxLength="10"
                placeholder="Enter 10-digit phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none shadow-sm"
              />
            </div>
            {phoneNumber && phoneNumber.length !== 10 && (
              <p className="text-xs text-red-500 mt-1">Please enter a valid 10-digit phone number</p>
            )}
          </div>

          {/* UPI App Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">UPI App</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaMobileAlt className="text-gray-400" />
              </div>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none shadow-sm appearance-none bg-white"
              >
                <option value="">Select UPI App</option>
                {upiProviders.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Amount (Max: ₹5,00,000)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaRupeeSign className="text-gray-400" />
              </div>
              <input
                type="number"
                placeholder="Enter amount in INR"
                value={amount}
                onChange={handleAmountChange}
                max={MAX_AMOUNT}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none shadow-sm"
              />
            </div>
            {amount > 0 && (
              <p className="text-sm text-blue-600 mt-1.5 font-medium">
                Amount: ₹{Number(amount).toLocaleString('en-IN')}
              </p>
            )}
          </div>

          {/* UPI ID Display */}
          <AnimatePresence>
            {provider && phoneNumber && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="text-sm bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-100">
                  <span className="font-medium text-blue-700">Your UPI ID:</span>
                  <span className="font-mono text-indigo-700 ml-1">{generateUpiId()}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Turnstile Verification */}
          <div className="flex justify-center my-4">
            <Turnstile
              siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
              onSuccess={(token) => setTurnstileToken(token)}
              options={{ theme: 'light' }}
            />
          </div>

          {/* Generate QR Code Button */}
          <motion.button
            onClick={generateQRCode}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={!turnstileToken || isGenerating}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isGenerating ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <FaQrcode className="mr-2" /> Generate QR Code
              </span>
            )}
          </motion.button>
        </div>

        {/* QR Code Display and Download */}
        <AnimatePresence>
          {upiLink && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-8 flex flex-col items-center space-y-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-inner"
              ref={qrCodeRef}
            >
              <div className="bg-white p-4 rounded-lg shadow-md">
                <QRCode value={upiLink} size={200} />
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 font-medium">Scan with any UPI app to pay</p>
                {amount > 0 && (
                  <p className="text-lg font-bold text-blue-700 mt-1">₹{Number(amount).toLocaleString('en-IN')}</p>
                )}
              </div>
              <div className="mt-4 w-full space-y-2">
                <motion.button
                  onClick={downloadQRCode}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium py-3.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaDownload /> Download QR Code
                </motion.button>

                <motion.button
                  onClick={saveTransaction}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    <>
                      <FaSave /> Save Transaction
                    </>
                  )}
                </motion.button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default QrCodePayments;