import React from 'react';
import { FaBell, FaLock, FaUser, FaGlobe, FaMoon, FaDesktop } from 'react-icons/fa';

const Settings = () => {
  // These are just placeholder settings sections with no backend functionality
  const settingSections = [
    {
      id: 'account',
      title: 'Account Settings',
      icon: <FaUser className="text-blue-500" />,
      description: 'Manage your account information and preferences'
    },
    {
      id: 'security',
      title: 'Privacy & Security',
      icon: <FaLock className="text-green-500" />,
      description: 'Update your security preferences and password'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: <FaBell className="text-yellow-500" />,
      description: 'Configure how you want to receive alerts and notices'
    },
    {
      id: 'appearance',
      title: 'Appearance',
      icon: <FaDesktop className="text-purple-500" />,
      description: 'Customize how SuvidhaPay looks for you'
    },
    {
      id: 'language',
      title: 'Language & Region',
      icon: <FaGlobe className="text-red-500" />,
      description: 'Select your preferred language and regional settings'
    },
    {
      id: 'theme',
      title: 'Theme Settings',
      icon: <FaMoon className="text-indigo-500" />,
      description: 'Choose between light and dark mode'
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Settings</h1>
          <p className="text-gray-600 mb-4">
            Customize your SuvidhaPay experience. These features will be implemented in future updates.
          </p>
          <div className="h-1 w-20 bg-blue-500 rounded-full mb-6"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {settingSections.map((section) => (
            <div 
              key={section.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-blue-500 hover:border-blue-600"
            >
              <div className="flex items-center mb-3">
                <div className="p-2 bg-gray-100 rounded-full mr-3">
                  {section.icon}
                </div>
                <h2 className="text-xl font-semibold text-gray-800">{section.title}</h2>
              </div>
              <p className="text-gray-600">{section.description}</p>
              <div className="mt-4 flex justify-end">
                <button className="text-blue-500 hover:text-blue-700 text-sm font-medium">
                  Coming Soon
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 bg-blue-50 rounded-lg p-6 shadow-sm border border-blue-100">
          <div className="flex items-start">
            <div className="mr-4 bg-blue-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Settings Coming Soon</h3>
              <p className="text-gray-600">
                We're working hard to bring you these customization options. Thank you for your patience!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;