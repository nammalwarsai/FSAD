import React from 'react';
import { 
  FaPlus, 
  FaCreditCard, 
  FaLock, 
  FaUnlock, 
  FaEye, 
  FaEyeSlash, 
  FaHistory,
  FaBell,
  FaGlobe,
  FaShieldAlt,
  FaExclamationTriangle,
  FaCog,
  FaFileAlt,
  FaChartLine
} from 'react-icons/fa';

const Cards = ({ 
  cards = [], 
  onAddCard,
  onToggleCardLock,
  onToggleCardDetails,
  onSetLimits,
  onManagePin,
  onToggleInternational,
  onGenerateStatement,
  onReportLost,
  onViewHistory,
  notifications = []
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Card Management</h2>
        <button className="p-2 relative">
          <FaBell className="text-xl" />
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={onAddCard}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <FaPlus className="mr-2" /> Add New Card
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FaShieldAlt className="mr-2" /> Card Security
          </h3>
          <div className="space-y-2">
            <button 
              onClick={onSetLimits}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded flex items-center"
            >
              <FaChartLine className="mr-2" /> Set Transaction Limits
            </button>
            <button 
              onClick={onManagePin}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded flex items-center"
            >
              <FaCog className="mr-2" /> Manage Card PIN
            </button>
            <button 
              onClick={onToggleInternational}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded flex items-center"
            >
              <FaGlobe className="mr-2" /> Enable International Usage
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FaCreditCard className="mr-2" /> Card Services
          </h3>
          <div className="space-y-2">
            <button 
              onClick={onGenerateStatement}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded flex items-center"
            >
              <FaFileAlt className="mr-2" /> Generate Statement
            </button>
            <button 
              onClick={onReportLost}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded flex items-center"
            >
              <FaExclamationTriangle className="mr-2" /> Report Lost Card
            </button>
            <button 
              onClick={onViewHistory}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded flex items-center"
            >
              <FaHistory className="mr-2" /> View Transaction History
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map(card => (
          <div key={card.id} className="relative group perspective-1000">
            <div className={`bg-gradient-to-r from-blue-600 to-blue-400 p-6 rounded-xl shadow-lg transform transition-transform duration-500 ${
              card.isLocked ? 'opacity-75' : ''
            }`}>
              <div className="flex justify-between items-start mb-8">
                <FaCreditCard className="text-white text-2xl" />
                <div className="space-x-2">
                  <button 
                    onClick={() => onToggleCardLock(card.id)}
                    className="text-white hover:text-gray-200"
                  >
                    {card.isLocked ? <FaLock /> : <FaUnlock />}
                  </button>
                  <button 
                    onClick={() => onToggleCardDetails(card.id)}
                    className="text-white hover:text-gray-200"
                  >
                    {card.showDetails ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div className="text-white space-y-4">
                <p className="text-xl">
                  {card.showDetails ? card.cardNumber : card.cardNumber.replace(/\d{4}(?= \d{4})/g, '****')}
                </p>
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm opacity-75">Card Holder</p>
                    <p>{card.cardHolder}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-75">Expires</p>
                    <p>{card.expiryDate}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-75">Type</p>
                    <p>{card.type}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cards; 