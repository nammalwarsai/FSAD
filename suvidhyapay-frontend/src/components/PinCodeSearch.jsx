import React, { useState } from "react";

const PinCodeSearch = ({ onPinCodeVerified }) => {
  const [pinCode, setPinCode] = useState("");
  const [pinDetails, setPinDetails] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handlePinCodeChange = (e) => {
    setPinCode(e.target.value);
    setPinDetails(null);
    setError("");
  };

  const verifyPinCode = async () => {
    if (pinCode.length === 6 && /^\d{6}$/.test(pinCode)) {
      setIsLoading(true);
      setIsAnimating(true);
      
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pinCode}`);
        const data = await response.json();
        
        if (data[0].Status === "Success") {
          const details = {
            pinCode,
            district: data[0].PostOffice[0].District,
            state: data[0].PostOffice[0].State,
            officeName: data[0].PostOffice[0].Name,
          };
          
          setPinDetails(details);
          setError("");
          
          // Pass the verified pin code details to parent component if callback provided
          if (onPinCodeVerified) {
            onPinCodeVerified(details);
          }
        } else {
          setPinDetails(null);
          setError("Invalid PIN Code - No results found");
        }
      } catch (error) {
        setPinDetails(null);
        setError("Failed to verify PIN Code. Please try again later.");
      } finally {
        setIsLoading(false);
        setTimeout(() => setIsAnimating(false), 500);
      }
    } else {
      setError("Please enter a valid 6-digit PIN Code");
    }
  };

  return (
    <div className="w-full rounded-xl p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 shadow-md hover:shadow-lg transition-all duration-300">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Locate Your Address</h3>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <input
            type="text"
            value={pinCode}
            onChange={handlePinCodeChange}
            maxLength={6}
            className="w-full px-4 py-3 rounded-xl transition-all duration-200 bg-white border-2 border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none text-gray-900 text-base placeholder-gray-400 shadow-sm hover:border-indigo-300 pr-10"
            placeholder="Enter 6-digit PIN code"
          />
          {pinCode.length > 0 && (
            <button
              type="button"
              onClick={() => setPinCode("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              ✕
            </button>
          )}
        </div>
        
        <button
          type="button"
          onClick={verifyPinCode}
          disabled={isLoading}
          className={`px-5 py-3 rounded-xl text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 font-medium flex items-center justify-center ${isAnimating ? 'animate-pulse' : ''}`}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
              </svg>
              Verify PIN Code
            </>
          )}
        </button>
      </div>
      
      {error && (
        <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200 text-red-600 text-sm animate-fade-in">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z" clipRule="evenodd"></path>
            </svg>
            {error}
          </div>
        </div>
      )}
      
      {pinDetails && (
        <div className="mt-4 overflow-hidden rounded-xl border border-indigo-200 bg-white shadow-md transition-all duration-300 transform animate-fade-in">
          <div className="p-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">PIN Code Details</h4>
              <span className="px-2 py-1 bg-white text-indigo-600 rounded-lg text-xs font-bold">{pinCode}</span>
            </div>
          </div>
          
          <div className="p-4 space-y-3">
            <div className="flex items-center border-b border-gray-100 pb-2">
              <svg className="w-5 h-5 mr-3 text-indigo-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4zm3 1h6v4H7V5zm8 8v2h1v1H4v-1h1v-2H4v-1h16v1h-1z" clipRule="evenodd"></path>
              </svg>
              <div>
                <p className="text-xs text-gray-500">Post Office</p>
                <p className="font-medium text-gray-800">{pinDetails.officeName}</p>
              </div>
            </div>
            
            <div className="flex items-center border-b border-gray-100 pb-2">
              <svg className="w-5 h-5 mr-3 text-indigo-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
              </svg>
              <div>
                <p className="text-xs text-gray-500">District</p>
                <p className="font-medium text-gray-800">{pinDetails.district}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3 text-indigo-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
              </svg>
              <div>
                <p className="text-xs text-gray-500">State</p>
                <p className="font-medium text-gray-800">{pinDetails.state}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PinCodeSearch;