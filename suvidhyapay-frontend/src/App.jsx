import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Settings from './components/Settings';
import QrCodePayments from './components/QrCodePayments';
import CurrencyConverter from './components/CurrencyConverter';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import Mfa_google from './components/Mfa_google';
import PinCodeSearch from './components/PinCodeSearch';
import MailUs from './components/MailUs';
import PTGW from './components/PTGW';
import RequestLoan from './components/RequestLoan';
import MyTransactions from './components/MyTransactions';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="w-full min-h-screen bg-gray-100">
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/pp" element={<PrivacyPolicy />} />
            <Route path="/tos" element={<TermsOfService />} />
            <Route path="/mfa" element={<Mfa_google />} />
            
            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<Navigate to="/dashboard/profile" replace />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
              <Route path="qr-payments" element={<QrCodePayments />} />
              <Route path="currency-converter" element={<CurrencyConverter />} />
              <Route path="pincode-search" element={<PinCodeSearch />} />
              <Route path="mailus" element={<MailUs />} />
              <Route path="payment-gateway" element={<PTGW />} />
              <Route path="request-loan" element={<RequestLoan />} />
              <Route path="my-transactions" element={<MyTransactions />} />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
