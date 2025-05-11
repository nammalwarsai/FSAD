import React, { useState } from 'react';
import { useNavigate, useLocation, Link, Outlet } from 'react-router-dom';
import { 
  FaHome, 
  FaUserCircle, 
  FaCog, 
  FaSignOutAlt, 
  FaBars, 
  FaTimes, 
  FaQrcode, 
  FaExchangeAlt, 
  FaMapMarkerAlt, 
  FaCreditCard, 
  FaMoneyBillWave,
  FaHistory
} from 'react-icons/fa';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const sidebarItems = [
    { icon: <FaHome className="w-5 h-5" />, label: "Dashboard", path: "/dashboard" },
    { icon: <FaUserCircle className="w-5 h-5" />, label: "Profile", path: "/dashboard/profile" },
    { icon: <FaCreditCard className="w-5 h-5" />, label: "Payment Gateway", path: "/dashboard/payment-gateway" },
    { icon: <FaMoneyBillWave className="w-5 h-5" />, label: "Request Loan", path: "/dashboard/request-loan" },
    { icon: <FaQrcode className="w-5 h-5" />, label: "QR Payments", path: "/dashboard/qr-payments" },
    { icon: <FaHistory className="w-5 h-5" />, label: "My Transactions", path: "/dashboard/my-transactions" },
    { icon: <FaExchangeAlt className="w-5 h-5" />, label: "Currency Converter", path: "/dashboard/currency-converter" },
    { icon: <FaMapMarkerAlt className="w-5 h-5" />, label: "Pin Code Search", path: "/dashboard/pincode-search" },
    //{ icon: <FaCog className="w-5 h-5" />, label: "Settings", path: "/dashboard/settings" },
    
  ];

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const renderMainDashboard = () => {
    if (location.pathname === '/dashboard') {
      return (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to SuvidhaPay Dashboard</h2>
          <p className="text-lg text-gray-600">
            Use the sidebar to navigate through different sections of your account.
          </p>
        </div>
      );
    }
    return <Outlet />;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static w-64 bg-blue-800 text-white h-full z-30 transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">SuvidhaPay</h1>
          <button 
            className="lg:hidden text-black bg-white rounded-full p-1"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
        <nav className="mt-6 flex flex-col h-[calc(100%-160px)] justify-between">
          <div>
            {sidebarItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-6 py-4 text-gray-100 hover:bg-blue-700 ${
                  location.pathname === item.path ? 'bg-blue-700' : ''
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                {item.icon}
                <span className="mx-3">{item.label}</span>
              </Link>
            ))}
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center px-6 py-4 text-white bg-red-600 hover:bg-red-700 transition-colors duration-200 ease-in-out mx-4 rounded-lg shadow-md mt-auto mb-6"
          >
            <FaSignOutAlt className="w-5 h-5" />
            <span className="mx-3 font-medium">Logout</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Navigation */}
        <header className="bg-white shadow">
          <div className="flex justify-between items-center px-4 lg:px-8 py-4">
            <div className="flex items-center">
              <button 
                className="lg:hidden mr-4 text-gray-600"
                onClick={() => setSidebarOpen(true)}
              >
                <FaBars className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-semibold text-gray-800">
                {sidebarItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
              </h2>
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <main className="p-8">
          {renderMainDashboard()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;