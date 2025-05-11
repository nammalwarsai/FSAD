import React, { useState, useEffect } from 'react';
import api from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    username: '',
    fullName: '',
    phoneNumber: '',
    address: '',
    created_at: '',
    aadharnumber: '',
    dob: '',
    emailid: '',
    pannumber: '',
    balance: '0'
  });
  const [editableData, setEditableData] = useState({});

  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return format(parseISO(dateString), 'yyyy-MM-dd');
    } catch (error) {
      console.error('Date formatting error:', error);
      return dateString || 'Not provided';
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchUserProfile = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          toast.error('Please login to view profile');
          navigate('/login');
          return;
        }

        const response = await api.get(`/api/users/profile/${userId}`);
        
        if (response.data && isMounted) {
          const data = response.data;
          const formattedData = {
            username: data.username || '',
            fullName: data.fullName || '',
            phoneNumber: data.phoneNumber || '',
            address: data.address || '',
            created_at: formatDate(data.created_at),
            aadharnumber: data.aadharnumber || '',
            dob: data.dob ? formatDate(data.dob) : '',
            emailid: data.emailid || '',
            pannumber: data.pannumber || '',
            balance: data.balance?.toString() || '0'
          };
          setUserData(formattedData);
          setEditableData(formattedData);
          setError(null);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Profile fetch error:', error);
          const errorMessage = error.response?.data?.error || error.message;
          setError(errorMessage);
          toast.error('Error loading profile data');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUserProfile();
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditableData({ ...userData });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditableData({ ...userData });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSave = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        toast.error('Please login to update profile');
        navigate('/login');
        return;
      }

      // Validate required fields
      if (!editableData.phoneNumber?.trim()) {
        toast.error('Phone number is required');
        return;
      }
      if (!editableData.aadharnumber?.trim()) {
        toast.error('Aadhar number is required');
        return;
      }
      if (!editableData.pannumber?.trim()) {
        toast.error('PAN number is required');
        return;
      }
      if (!editableData.dob) {
        toast.error('Date of Birth is required');
        return;
      }

      // Validate date format
      const dobDate = new Date(editableData.dob);
      if (isNaN(dobDate.getTime())) {
        toast.error('Invalid date format for Date of Birth');
        return;
      }

      // Only send the editable fields with formatted date
      const updateData = {
        phoneNumber: editableData.phoneNumber.trim(),
        address: editableData.address?.trim() || '',
        dob: format(dobDate, 'yyyy-MM-dd'),
        aadharnumber: editableData.aadharnumber.trim(),
        pannumber: editableData.pannumber.trim()
      };

      const response = await api.put(`/api/users/profile/${userId}`, updateData);
      
      if (response.data) {
        setUserData(prev => ({
          ...prev,
          ...response.data
        }));
        setIsEditing(false);
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.error || 'Error updating profile');
    }
  };

  const renderField = (label, name, value, isEditable = false) => {
    return (
      <div className="flex flex-col space-y-1">
        <span className="text-sm text-gray-500">{label}</span>
        {isEditing && isEditable ? (
          <input
            type={name === 'dob' ? 'date' : 'text'}
            name={name}
            value={editableData[name] || ''}
            onChange={handleChange}
            className="text-gray-800 p-2 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
          />
        ) : (
          <span className="text-gray-800 p-2 bg-gray-50 rounded-lg">
            {value || 'Not provided'}
          </span>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-6 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Profile</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaEdit className="mr-2" />
            Edit Profile
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FaSave className="mr-2" />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FaTimes className="mr-2" />
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Account Information</h3>
          {renderField('Username', 'username', userData.username)}
          {renderField('Email', 'emailid', userData.emailid)}
          {renderField('Full Name', 'fullName', userData.fullName)}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Personal Information</h3>
          {renderField('Date of Birth', 'dob', userData.dob, true)}
          {renderField('Phone Number', 'phoneNumber', userData.phoneNumber, true)}
          {renderField('Address', 'address', userData.address, true)}
        </div>        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Identity Information</h3>
          {renderField('Aadhar Number', 'aadharnumber', userData.aadharnumber, true)}
          {renderField('PAN Number', 'pannumber', userData.pannumber, true)}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Account Statistics</h3>
          {renderField('Balance', 'balance', `₹${userData.balance}`)}
          {renderField('Created At', 'created_at', userData.created_at)}
        </div>
      </div>
    </div>
  );
};

export default Profile;