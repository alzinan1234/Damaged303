'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeftIcon,
  TrashIcon,
  CheckCircleIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

const NotificationPage = ({ onBackClick }) => {

  const [allNotifications, setAllNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  
  // Push notification form states
  const [pushTitle, setPushTitle] = useState('');
  const [pushRecipient, setPushRecipient] = useState('');
  const [pushDescription, setPushDescription] = useState('');
  const [pushDate, setPushDate] = useState('');
  const [pushTime, setPushTime] = useState('');
  
  const now = useMemo(() => new Date(), []);

  // Get auth token from cookie
  const getAuthToken = () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("adminToken="));
    return token ? token.split("=")[1] : null;
  };

  // Fetch notifications from API
  const fetchNotifications = async (page = 1) => {
    try {
      setLoading(true);
      const token = getAuthToken();
      
      if (!token) {
        toast.error('Authentication token not found. Please login again.');
        return;
      }

      const response = await axios.get(
        `https://maintains-usb-bell-with.trycloudflare.com/api/dashboard/notifications/?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = response.data;
      setAllNotifications(data.results || []);
      setTotalCount(data.count || 0);
      setNextPage(data.next);
      setPreviousPage(data.previous);
      
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  // Load notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  const getRelativeTime = (timeAgo) => {
    // Use the time_ago from API if available, otherwise fallback to calculation
    if (timeAgo) {
      return timeAgo;
    }
    return 'Just now';
  };

  const groupedNotifications = useMemo(() => {
    const today = [];
    const yesterday = [];
    const older = [];

    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);

    allNotifications.forEach(notif => {
      // Since we don't have exact timestamps, we'll use time_ago to categorize
      const timeAgo = notif.time_ago || '';
      
      if (timeAgo.includes('minute') || timeAgo.includes('hour')) {
        today.push(notif);
      } else if (timeAgo.includes('1 day') || timeAgo.includes('yesterday')) {
        yesterday.push(notif);
      } else {
        older.push(notif);
      }
    });

    return { today, yesterday, older };
  }, [allNotifications, now]);

  // Delete notification
  const handleDeleteNotification = async (id) => {
    const toastId = toast.loading('Deleting notification...');
    
    try {
      const token = getAuthToken();
      
      if (!token) {
        toast.error('Authentication token not found', { id: toastId });
        return;
      }

      await axios.delete(
        `https://maintains-usb-bell-with.trycloudflare.com/api/dashboard/notifications/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Remove from local state immediately for instant update
      setAllNotifications(prev => prev.filter(notif => notif.id !== id));
      setTotalCount(prev => prev - 1);
      
      toast.success('Notification deleted successfully!', { id: toastId });
      
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification', { id: toastId });
    }
  };

  // Toggle read status
  const handleToggleReadStatus = async (id) => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }

      const notification = allNotifications.find(n => n.id === id);
      
      await axios.patch(
        `https://maintains-usb-bell-with.trycloudflare.com/api/dashboard/notifications/${id}/`,
        {
          is_read: !notification.is_read
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Update local state
      setAllNotifications(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, is_read: !notif.is_read } : notif
        )
      );
      
      toast.success('Notification status updated!');
      
    } catch (error) {
      console.error('Error updating notification:', error);
      toast.error('Failed to update notification status');
    }
  };
  
  // Send new push notification
  const handleSendPushNotification = async () => {
    if (!pushRecipient || !pushTitle || !pushDescription) {
      toast.error('Please fill in all fields to send a notification.');
      return;
    }

    const toastId = toast.loading('Sending notification...');

    try {
      const token = getAuthToken();
      
      if (!token) {
        toast.error('Authentication token not found', { id: toastId });
        return;
      }

      const payload = {
        title: pushTitle,
        message: pushDescription,
        recipient: pushRecipient,
        notification_type: 'push',
      };

      // Add scheduled time if both date and time are provided
      if (pushDate && pushTime) {
        payload.sent_at = `${pushDate}T${pushTime}:00`;
      }

      const response = await axios.post(
        'https://maintains-usb-bell-with.trycloudflare.com/api/dashboard/notifications/send/',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Clear form
      setPushRecipient('');
      setPushTitle('');
      setPushDescription('');
      setPushDate('');
      setPushTime('');

      // Add the new notification to the top of the list immediately
      const newNotification = {
        id: Date.now(), // Temporary ID until we refresh
        title: pushTitle,
        message: pushDescription,
        recipient: pushRecipient,
        notification_type: 'push',
        is_read: false,
        sent_at: payload.sent_at || null,
        time_ago: 'Just now'
      };

      // Add to the beginning of notifications array for instant update
      setAllNotifications(prev => [newNotification, ...prev]);
      setTotalCount(prev => prev + 1);

      toast.success('Notification sent successfully!', { id: toastId });

      // Refresh the first page to get the actual data from server
      setTimeout(() => {
        fetchNotifications(1);
        setCurrentPage(1);
      }, 1000);
      
    } catch (error) {
      console.error('Error sending notification:', error);
      const errorMessage = error.response?.data?.message || 'Failed to send notification';
      toast.error(errorMessage, { id: toastId });
    }
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (nextPage) {
      const pageNumber = currentPage + 1;
      setCurrentPage(pageNumber);
      fetchNotifications(pageNumber);
    }
  };

  const handlePreviousPage = () => {
    if (previousPage) {
      const pageNumber = currentPage - 1;
      setCurrentPage(pageNumber);
      fetchNotifications(pageNumber);
    }
  };

  const NotificationItem = ({ notification }) => {
    const statusClasses = notification.is_read ? 'text-gray-500' : 'text-black';

    return (
      <div className='p-5 border-b border-gray-200 last:border-b-0'>
        <div className={`flex items-center justify-between ${statusClasses} transition-colors duration-200`}>
          <div className="flex-grow">
            <p className="text-xs text-gray-500 font-semibold">{notification.recipient}</p>
            <p className="text-base font-semibold">{notification.title}</p>
            <p className="text-sm">{notification.message}</p>
            <span className="text-xs text-gray-400 whitespace-nowrap">
              {getRelativeTime(notification.time_ago)}
            </span>
          </div>
          <div className="flex items-center justify-center space-x-2 ml-4">
            <button
              onClick={() => handleDeleteNotification(notification.id)}
              className="text-red-600 hover:text-red-400 p-1 rounded-full transition-colors duration-200"
              aria-label="Delete notification"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl text-black p-6 sm:p-6 lg:p-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-500">Loading notifications...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl text-black p-6 sm:p-6 lg:p-8">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <button
            className="text-black bg-gray-200 rounded-[33px] p-[10px] hover:bg-gray-300 transition-colors duration-200"
            onClick={onBackClick}
            aria-label="Go back"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <h1 className="text-[24px] font-medium">
            Notification ({totalCount})
          </h1>
        </div>
      </div>

      {/* New Push Notification Section */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold text-black mb-3">Send New Notification</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Recipient (e.g., user@example.com)"
            value={pushRecipient}
            onChange={(e) => setPushRecipient(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Notification Title"
            value={pushTitle}
            onChange={(e) => setPushTitle(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <textarea
          placeholder="Notification Description"
          value={pushDescription}
          onChange={(e) => setPushDescription(e.target.value)}
          rows="2"
          className="w-full mt-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
        />
        
        {/* Date and Time Fields */}
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Date (Optional)</label>
            <input
              type="date"
              value={pushDate}
              onChange={(e) => setPushDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Time (Optional)</label>
            <input
              type="time"
              value={pushTime}
              onChange={(e) => setPushTime(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <button
          onClick={handleSendPushNotification}
          className="mt-4 w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-[#013D3B] text-white font-semibold rounded-md hover:bg-[#013D3B]/90 transition-colors duration-200"
        >
          <PaperAirplaneIcon className="h-5 w-5 rotate-90" />
          Send Notification
        </button>
      </div>

      {/* Notification List Container */}
      <div className="rounded-lg overflow-hidden">
        {Object.keys(groupedNotifications).map(groupName => {
          const notifications = groupedNotifications[groupName];
          if (notifications.length === 0) return null;
          return (
            <div key={groupName} className="py-2">
              <h2 className="text-lg font-semibold text-black px-4 py-4">
                {groupName.charAt(0).toUpperCase() + groupName.slice(1)}
                <span className="text-[#71F50C] bg-[#71F50C1A] rounded-full text-[12px] p-2 px-3 font-normal ml-2">
                  {notifications.length}
                </span>
              </h2>
              <div className='border border-gray-200 rounded mt-2'>
                {notifications.map(notif => (
                  <NotificationItem key={notif.id} notification={notif} />
                ))}
              </div>
            </div>
          );
        })}

        {allNotifications.length === 0 && (
          <p className="p-4 text-center text-gray-500">No notifications found.</p>
        )}
      </div>

      {/* Pagination */}
      {(nextPage || previousPage) && (
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={handlePreviousPage}
            disabled={!previousPage}
            className={`px-4 py-2 rounded-md font-medium ${
              previousPage
                ? 'bg-[#013D3B] text-white hover:bg-[#013D3B]/90'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Previous
          </button>
          
          <span className="text-sm text-gray-600">
            Page {currentPage}
          </span>
          
          <button
            onClick={handleNextPage}
            disabled={!nextPage}
            className={`px-4 py-2 rounded-md font-medium ${
              nextPage
                ? 'bg-[#013D3B] text-white hover:bg-[#013D3B]/90'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationPage;