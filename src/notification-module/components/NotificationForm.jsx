import React, { useState } from 'react';
import {
  BellIcon,
  PaperAirplaneIcon,
  MagnifyingGlassIcon,
  ArrowDownCircleIcon
} from '@heroicons/react/24/outline';
import { notificationApi } from '../utils/apis';
import toast from 'react-hot-toast';

const NotificationForm = ({
  users,
  usersLoading,
  onNotificationSent,
  currentPage
}) => {
  const [pushTitle, setPushTitle] = useState('');
  const [pushRecipient, setPushRecipient] = useState('all');
  const [pushDescription, setPushDescription] = useState('');
  const [pushDate, setPushDate] = useState('');
  const [pushTime, setPushTime] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedNotificationTypes, setSelectedNotificationTypes] = useState(['push']); // New state
  const [isScheduled, setIsScheduled] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Available notification types
  const notificationTypes = [
    { id: 'push', label: 'Push Notification', icon: '📱' },
    { id: 'email', label: 'Email', icon: '✉️' },
    { id: 'in_app', label: 'In-App', icon: '🔔' },
    // { id: 'sms', label: 'SMS', icon: '💬' }
  ];

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  // Helper function to convert local datetime to UTC ISO string
  const convertToUTCISOString = (date, time) => {
    try {
      const localDateTime = new Date(`${date}T${time}`);
      if (isNaN(localDateTime.getTime())) {
        throw new Error('Invalid date or time');
      }
      return localDateTime.toISOString();
    } catch (error) {
      console.error('Error converting datetime:', error);
      throw new Error('Invalid date or time format');
    }
  };

  const handleNotificationTypeChange = (typeId) => {
    setSelectedNotificationTypes(prev => {
      if (prev.includes(typeId)) {
        // Don't allow removing all types
        if (prev.length === 1) {
          toast.error('At least one notification type must be selected');
          return prev;
        }
        return prev.filter(id => id !== typeId);
      } else {
        return [...prev, typeId];
      }
    });
  };

const handleSendPushNotification = async () => {
  // ... validation checks remain the same ...

  const loadingToast = toast.loading(isScheduled ? 'Scheduling notification...' : 'Sending notification...');

  try {
    let payload = {
      title: pushTitle,
      message: pushDescription,
      recipient_type: pushRecipient,
      notification_types: selectedNotificationTypes,
      // Include empty user_ids array for 'all' recipients
      user_ids: pushRecipient === 'specific' ? selectedUsers : []
    };

    console.log('Sending payload:', payload);

    let response;
    if (isScheduled && pushDate && pushTime) {
      try {
        payload.scheduled_at = convertToUTCISOString(pushDate, pushTime);
        
        const scheduledTime = new Date(payload.scheduled_at);
        const currentTime = new Date();
        
        if (scheduledTime <= currentTime) {
          toast.dismiss(loadingToast);
          toast.error('Scheduled time must be in the future');
          return;
        }
        
        response = await notificationApi.schedule(payload);
        console.log('Schedule response:', response);
        
        clearForm();
        toast.dismiss(loadingToast);
        toast.success(
          `Notification scheduled successfully! Will be sent to ${response.data?.total_users || 0} users 🎉`,
          {
            duration: 4000,
            style: {
              background: '#10B981',
              color: 'white',
            },
          }
        );
      } catch (dateError) {
        toast.dismiss(loadingToast);
        toast.error('Invalid date or time format. Please check your input.');
        return;
      }
    } else {
      response = await notificationApi.sendImmediate(payload);
      console.log('Immediate send response:', response);
      
      clearForm();
      toast.dismiss(loadingToast);
      
      if (response.data?.sent_count === 0) {
        toast.warning(
          `Notification sent but reached 0 of ${response.data?.total_users || 0} users. Please check recipient settings.`,
          {
            duration: 5000,
            style: {
              background: '#F59E0B',
              color: 'white',
            },
          }
        );
      } else {
        toast.success(
          `Notification sent successfully! Reached ${response.data?.sent_count || 0} of ${response.data?.total_users || 0} users 🚀`,
          {
            duration: 4000,
            style: {
              background: '#10B981',
              color: 'white',
            },
          }
        );
      }
    }

    onNotificationSent(currentPage);

  } catch (error) {
    console.error('Error sending notification:', error);
    toast.dismiss(loadingToast);
    
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message ||
                        'Failed to send notification';
    
    toast.error(`Error: ${errorMessage}. Please check the console for details.`, {
      duration: 5000,
      style: {
        background: '#EF4444',
        color: 'white',
      },
    });
    console.log('Full error details:', {
      error,
      response: error.response?.data,
      payload
    });
  }
};
  const clearForm = () => {
    setPushTitle('');
    setPushDescription('');
    setPushRecipient('all');
    setSelectedUsers([]);
    setSelectedNotificationTypes(['push']);
    setPushDate('');
    setPushTime('');
    setIsScheduled(false);
    setUserSearchTerm('');
    setShowUserDropdown(false);
  };

  const handleUserSelect = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    } else {
      setSelectedUsers(prev => [...prev, userId]);
    }
  };

  const getSelectedUserNames = () => {
    return selectedUsers.map(id => {
      const user = users.find(u => u.id === id);
      return user ? (user.name || user.email || user.username) : '';
    }).filter(Boolean).join(', ');
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMinTime = () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    if (pushDate === today) {
      const currentTime = new Date(now.getTime() + 60000);
      return currentTime.toTimeString().slice(0, 5);
    }
    
    return '';
  };

  return (
    <div className="rounded shadow-xl p-8 mb-8 animate-fade-in">
      <h2 className="text-[22px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#B2F7EF] via-[#001818] to-[#006663] drop-shadow-lg mb-6 flex items-center gap-3">
        <BellIcon className="h-7 w-7 text-[#00504d]" />
        <span className='text-[#000000]'>Create New Notification</span>
      </h2>

      {/* Notification Types Selection */}
      <div className="mb-6">
        <label className="block text-sm font-bold text-black mb-2">Notification Types</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {notificationTypes.map(type => (
            <label key={type.id} className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={selectedNotificationTypes.includes(type.id)}
                onChange={() => handleNotificationTypeChange(type.id)}
                className="h-4 w-4 text-[#013D3B] rounded"
              />
              <span className="text-lg">{type.icon}</span>
              <span className="text-sm font-medium text-black">{type.label}</span>
            </label>
          ))}
        </div>
        {selectedNotificationTypes.length > 0 && (
          <p className="text-xs text-gray-600 mt-2">
            Selected: {selectedNotificationTypes.map(id => 
              notificationTypes.find(t => t.id === id)?.label
            ).join(', ')}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-6">
        <div>
          <label className="block text-sm font-bold text-black mb-2">Recipients</label>
          <select
            value={pushRecipient}
            onChange={(e) => {
              setPushRecipient(e.target.value);
              if (e.target.value === 'all') {
                setSelectedUsers([]);
                setShowUserDropdown(false);
              }
            }}
            className="w-full p-4 border border-gray-400 rounded shadow-lg focus:outline-none text-black bg-white"
          >
            <option value="all">All Users</option>
            <option value="specific">Select Specific Users</option>
          </select>
        </div>
      </div>

      {pushRecipient === 'specific' && (
        <div className="mb-6">
          <label className="block text-sm font-bold text-black mb-2">Select Users</label>
          <div className="relative">
            <div
              className="w-full p-4 border border-gray-400 rounded-xl cursor-pointer flex items-center justify-between shadow-lg bg-white"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
            >
              <span className="text-[#000000] font-semibold">
                {selectedUsers.length === 0
                  ? 'Click to select users...'
                  : `${selectedUsers.length} user(s) selected: ${getSelectedUserNames().substring(0, 50)}${getSelectedUserNames().length > 50 ? '...' : ''}`
                }
              </span>
              <ArrowDownCircleIcon className={`h-7 w-7 text-[#0A6E6E] transition-transform ${showUserDropdown ? 'rotate-180' : ''} drop-shadow-lg`} />
            </div>
            {showUserDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-400 rounded-xl shadow-2xl max-h-60 overflow-hidden animate-fade-in">
                <div className="p-4 border-b border-[#013D3B]/20">
                  <div className="relative">
                    <MagnifyingGlassIcon className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#0A6E6E]" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-3 py-3 border border-gray-400 rounded-xl focus:outline-none text-black bg-white"
                    />
                  </div>
                </div>

                <div className="max-h-48 overflow-y-auto">
                  {usersLoading ? (
                    <div className="p-4 text-center text-[#0A6E6E]">Loading users...</div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="p-4 text-center text-[#0A6E6E]">No users found</div>
                  ) : (
                    filteredUsers.map(user => (
                      <label key={user.id} className="flex items-center space-x-3 p-4 hover:bg-[#B2F7EF]/60 cursor-pointer rounded-xl">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleUserSelect(user.id)}
                          className="h-5 w-5 text-black rounded border-black"
                        />
                        <div className="flex-grow">
                          <div className="text-base font-bold text-black">
                            {user.name || user.username || 'Unknown'}
                          </div>
                          <div className="text-xs text-black">{user.email}</div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full text-black ${
                          user.status === 'Active' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {user.status || 'Active'}
                        </span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-bold text-black mb-2">Title</label>
        <input
          type="text"
          placeholder="Enter notification title"
          value={pushTitle}
          onChange={(e) => setPushTitle(e.target.value)}
          className="w-full p-4 border border-gray-400 rounded shadow-lg focus:outline-none text-black bg-white"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-bold text-black mb-2">Message</label>
        <textarea
          placeholder="Enter notification message"
          value={pushDescription}
          onChange={(e) => setPushDescription(e.target.value)}
          rows="3"
          className="w-full p-4 border border-gray-400 rounded shadow-lg focus:outline-none text-black resize-none bg-white"
        />
      </div>

      <div className="mb-6">
        <label className="flex items-center gap-3 text-black">
          <input
            type="checkbox"
            checked={isScheduled}
            onChange={(e) => setIsScheduled(e.target.checked)}
            className="h-5 w-5 text-[#013D3B] rounded"
          />
          <span className="text-base font-bold text-black">Schedule for later</span>
        </label>
      </div>

      {isScheduled && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-bold text-[#013D3B] mb-2">
              Date <span className="text-xs text-gray-600">(your local timezone)</span>
            </label>
            <input
              type="date"
              value={pushDate}
              onChange={(e) => {
                setPushDate(e.target.value);
                if (e.target.value === getMinDate() && pushTime && pushTime < getMinTime()) {
                  setPushTime('');
                }
              }}
              min={getMinDate()}
              className="w-full p-4 border border-gray-400 rounded shadow-lg focus:outline-none text-black bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#013D3B] mb-2">
              Time <span className="text-xs text-gray-600">(your local timezone)</span>
            </label>
            <input
              type="time"
              value={pushTime}
              onChange={(e) => setPushTime(e.target.value)}
              min={getMinTime()}
              className="w-full p-4 border border-gray-400 rounded shadow-lg focus:outline-none text-black bg-white"
            />
            {pushDate === getMinDate() && (
              <p className="text-xs text-gray-600 mt-1">
                Minimum time: {getMinTime()} (current time + 1 minute)
              </p>
            )}
          </div>
        </div>
      )}

      {/* Debug payload preview */}
      {(pushTitle || pushDescription) && (
        <div className="mb-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-sm font-bold text-gray-700 mb-2">Payload Preview:</h3>
          <pre className="text-xs text-gray-600 overflow-auto">
            {JSON.stringify({
              title: pushTitle,
              message: pushDescription,
              recipient_type: pushRecipient,
              notification_types: selectedNotificationTypes,
              ...(pushRecipient === 'specific' && { user_ids: selectedUsers }),
              ...(isScheduled && pushDate && pushTime && { 
                scheduled_at: convertToUTCISOString(pushDate, pushTime) 
              })
            }, null, 2)}
          </pre>
        </div>
      )}

      <button
        onClick={handleSendPushNotification}
        className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#013D3B] via-[#0A6E6E] to-[#013D3B] text-white font-extrabold rounded shadow-xl hover:scale-105 hover:from-[#0A6E6E] hover:to-[#013D3B] transition-all duration-200"
      >
        <PaperAirplaneIcon className="h-6 w-6" />
        {isScheduled ? 'Schedule Notification' : 'Send Now'}
      </button>
    </div>
  );
};

export default NotificationForm;