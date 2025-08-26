import React from 'react';
import { TrashIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline';

const NotificationItem = ({ 
  notification, 
  isSelected, 
  onSelect, 
  onDelete, 
  onCancelScheduled 
}) => {
  const statusClasses = notification.is_read ? 'text-gray-500' : 'text-black';
  
  const getRelativeTime = (notification) => {
    // Handle different time formats from your API
    if (notification.sent_at) {
      return new Date(notification.sent_at).toLocaleString();
    }
    if (notification.created_at) {
      return new Date(notification.created_at).toLocaleString();
    }
    return 'Just now';
  };

  const getStatusBadge = () => {
    const status = notification.status;
    if (status === 'pending') {
      return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Pending</span>;
    }
    if (status === 'sent') {
      return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Sent</span>;
    }
    if (status === 'failed') {
      return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">Failed</span>;
    }
    return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">Unknown</span>;
  };

  const getTypeBadges = () => {
    const typeColors = {
      push: 'bg-blue-100 text-blue-800',
      email: 'bg-purple-100 text-purple-800',
      in_app: 'bg-indigo-100 text-indigo-800'
    };
    
    // Handle array of notification types from your API
    const types = notification.notification_types || ['push'];
    
    return types.map(type => (
      <span key={type} className={`${typeColors[type]} px-2 py-1 rounded-full text-xs capitalize mr-1`}>
        {type.replace('_', ' ')}
      </span>
    ));
  };

  const getRecipientText = () => {
    if (notification.recipient_type === 'all') {
      return `All Users (${notification.target_count || 0})`;
    }
    if (notification.recipient_type === 'specific') {
      return `${notification.target_count || 0} Selected Users`;
    }
    return 'Unknown Recipients';
  };

  return (
    <div className={`p-4 border-b border-gray-200 last:border-b-0 ${isSelected ? 'bg-blue-50' : 'bg-white'}`}>
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(notification.id, e.target.checked)}
          className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300"
        />
        
        <div className={`flex-grow ${statusClasses} transition-colors duration-200`}>
          <div className="flex items-start justify-between">
            <div className="flex-grow">
              <div className="flex items-center space-x-2 mb-1">
                {getTypeBadges()}
                {getStatusBadge()}
              </div>
              <p className="text-xs text-gray-500 font-medium mb-1">
                To: {getRecipientText()}
              </p>
              <p className="text-base font-semibold mb-1">{notification.title}</p>
              <p className="text-sm text-gray-700 mb-2">{notification.message}</p>
              
              {/* Show counts for sent notifications */}
              {notification.status === 'sent' && (
                <p className="text-xs text-gray-500 mb-2">
                  Sent: {notification.sent_count || 0} | Failed: {notification.failed_count || 0}
                </p>
              )}
              
              <div className="flex items-center space-x-4 text-xs text-gray-400">
                <span className="flex items-center space-x-1">
                  <ClockIcon className="h-3 w-3" />
                  <span>
                    {notification.status === 'pending' && notification.scheduled_at
                      ? `Scheduled for ${new Date(notification.scheduled_at).toLocaleString()}`
                      : getRelativeTime(notification)
                    }
                  </span>
                </span>
                {notification.created_by && (
                  <span>Created by: {notification.created_by.name}</span>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              {/* {notification.status === 'pending' && (
                <button
                  onClick={() => onCancelScheduled(notification)}
                  className="text-orange-600 hover:text-orange-400 p-1 rounded-full transition-colors"
                  title="Cancel scheduled notification"
                >
                  <XCircleIcon className="h-5 w-5" />
                </button>
              )} */}
              <button
                onClick={() => onDelete(notification)}
                className="text-red-600 hover:text-red-400 p-1 rounded-full transition-colors"
                title="Delete notification"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;