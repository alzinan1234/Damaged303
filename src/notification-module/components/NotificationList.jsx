import React from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import NotificationItem from './NotificationItem';

const NotificationList = ({ 
  groupedNotifications,
  selectedNotifications,
  onSelectNotification,
  onDeleteNotification,
  onCancelScheduled,
  filteredNotifications,
  onSelectAll
}) => {
  const groupTitles = {
    scheduled: 'Scheduled',
    today: 'Today',
    yesterday: 'Yesterday',
    older: 'Older'
  };

  return (
    <div>
      {/* Bulk Actions */}
      {filteredNotifications.length > 0 && (
        <div className="mb-4 flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedNotifications.length === filteredNotifications.length}
              onChange={(e) => onSelectAll(e.target.checked)}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <span className="text-sm font-medium">Select All</span>
          </label>
          <span className="text-sm text-gray-600">
            {selectedNotifications.length} of {filteredNotifications.length} selected
          </span>
        </div>
      )}

      {/* Notification Groups */}
      <div className="space-y-6">
        {Object.entries(groupedNotifications).map(([groupName, notifications]) => {
          if (notifications.length === 0) return null;
          
          return (
            <div key={groupName}>
              <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                <span>{groupTitles[groupName]}</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                  {notifications.length}
                </span>
              </h2>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                {notifications.map(notification => (
                  <NotificationItem 
                    key={notification.id} 
                    notification={notification}
                    isSelected={selectedNotifications.includes(notification.id)}
                    onSelect={onSelectNotification}
                    onDelete={onDeleteNotification}
                    onCancelScheduled={onCancelScheduled}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredNotifications.length === 0 && (
        <div className="text-center py-12">
          <BellIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-500 mb-2">No notifications found</p>
          <p className="text-gray-400">Try adjusting your filters or create a new notification</p>
        </div>
      )}
    </div>
  );
};

export default NotificationList;