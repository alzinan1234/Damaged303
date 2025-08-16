'use client';

import React, { useState, useMemo } from 'react';
import {
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  CheckCircleIcon,
  EyeIcon,
  PaperAirplaneIcon // For the new 'push' action
} from '@heroicons/react/24/outline';
import Image from 'next/image';

// Dummy data updated to use 'recipient' instead of 'user' for clarity
const initialNotifications = Array.from({ length: 50 }).map((_, i) => ({
  id: `notif-${i}`,
  recipient: `User ${i + 1}`, // Represents the user receiving the notification
  title: `New Message from Admin`,
  description: i % 2 === 0
    ? `You have a new message regarding your recent activity. Check it out now!`
    : `A new update is available. Tap here to learn more about the latest features.`,
  timestamp: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),
  isRead: Math.random() > 0.5,
}));

const NotificationPage = ({ onBackClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allNotifications, setAllNotifications] = useState(initialNotifications);
  const [pushTitle, setPushTitle] = useState('');
  const [pushRecipient, setPushRecipient] = useState('');
  const [pushDescription, setPushDescription] = useState('');
  const now = useMemo(() => new Date(), []);

  const getRelativeTime = (timestamp) => {
    const notificationDate = new Date(timestamp);
    const diffMinutes = Math.round((now.getTime() - notificationDate.getTime()) / (1000 * 60));
    const diffHours = Math.round(diffMinutes / 60);

    if (diffMinutes < 60) {
      return `${diffMinutes} min ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return notificationDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const groupedNotifications = useMemo(() => {
    const filtered = allNotifications.filter(notif =>
      notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notif.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notif.recipient.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const today = [];
    const yesterday = [];

    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);

    filtered.forEach(notif => {
      const notifDate = new Date(notif.timestamp);
      if (notifDate >= startOfToday) {
        today.push(notif);
      } else if (notifDate >= startOfYesterday) {
        yesterday.push(notif);
      }
      // "Older" notifications are not included in the display
    });

    return { today, yesterday };
  }, [allNotifications, searchTerm, now]);

  const handleDeleteNotification = (id) => {
    setAllNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const handleToggleReadStatus = (id) => {
    setAllNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, isRead: !notif.isRead } : notif
      )
    );
  };
  
  // New function to handle sending a new push notification
  const handleSendPushNotification = () => {
    if (!pushRecipient || !pushTitle || !pushDescription) {
      alert('Please fill in all fields to send a notification.');
      return;
    }

    const newNotification = {
      id: `new-notif-${Date.now()}`,
      recipient: pushRecipient,
      title: pushTitle,
      description: pushDescription,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    // Add the new notification to the top of the list
    setAllNotifications(prev => [newNotification, ...prev]);
    
    // Clear the input fields
    setPushRecipient('');
    setPushTitle('');
    setPushDescription('');

    alert(`Notification sent to ${newNotification.recipient} successfully!`);
  };

  const NotificationItem = ({ notification }) => {
    const statusClasses = notification.isRead ? 'text-gray-500' : 'text-black';

    return (
      <div className='p-5 border-b border-gray-200 last:border-b-0'>
        <div className={`flex items-start justify-between ${statusClasses} transition-colors duration-200`}>
          <div className="flex-grow">
            {/* Display the 'recipient' and 'created at' fields */}
            <p className="text-xs text-gray-500 font-semibold">{notification.recipient}</p>
            <p className="text-base font-semibold">{notification.title}</p>
            <p className="text-sm">{notification.description}</p>
            <span className="text-xs text-gray-400 whitespace-nowrap">
              {getRelativeTime(notification.timestamp)}
            </span>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            {/* Action buttons */}
            <button
              onClick={() => handleToggleReadStatus(notification.id)}
              className={`${notification.isRead ? 'text-blue-600' : 'text-purple-700'} hover:opacity-75 p-1 rounded-full transition-opacity duration-200`}
              aria-label={notification.isRead ? 'Mark as unread' : 'Mark as read'}
            >
              {notification.isRead ? (
                <CheckCircleIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
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

  return (
    <div className="bg-white rounded-2xl text-black p-6 sm:p-6 lg:p-8">
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
          <h1 className="text-[24px] font-medium">Notification</h1>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="pl-2 pr-5 py-2 bg-gray-100 rounded-tl-[7.04px] rounded border-[1px] border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <MagnifyingGlassIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
        </div>
      </div>

      {/* New Push Notification Section */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold text-black mb-3">Send New Notification</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Recipient (e.g., User 1)"
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
        <button
          onClick={handleSendPushNotification}
          className="mt-4 w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors duration-200"
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

        {groupedNotifications.today.length === 0 && groupedNotifications.yesterday.length === 0 && (
          <p className="p-4 text-center text-gray-500">No recent notifications found.</p>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;