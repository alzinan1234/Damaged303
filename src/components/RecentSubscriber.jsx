"use client";

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Client component for avatar image with fallback
function AvatarImage({ src, alt, fallbackText }) {
  const [imgSrc, setImgSrc] = useState(src);
  return (
    <img
      className="w-8 h-8 rounded-full object-cover"
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(`https://placehold.co/34x34/CCCCCC/000000?text=${fallbackText}`)}
    />
  );
}

// Main component for the Recent Subscribers and Token Users cards
const RecentSubscribersAndTokenUsers = () => {
  const router = useRouter();
  
  // States for API data
  const [recentSubscribers, setRecentSubscribers] = useState([]);
  const [recentTokenUsers, setRecentTokenUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // States to manage whether to show all items or limited list
  const [showAllSubscribers, setShowAllSubscribers] = useState(false);
  const [showAllTokenUsers, setShowAllTokenUsers] = useState(false);

  // Fetch data from API
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await axios.get("https://maintains-usb-bell-with.trycloudflare.com/api/dashboard/overview/");
        const apiData = response.data.data;

        // Map recent subscribers from API
        const subscribersFromApi = apiData.recent_subscribers.map((subscriber, index) => ({
          id: index + 1,
          name: subscriber.name,
          email: subscriber.email,
          time: subscriber.time,
          avatar: `https://placehold.co/34x34/60A5FA/FFFFFF?text=${subscriber.name.split(' ').map(n => n[0]).join('').toUpperCase()}`,
        }));

        // Map recent token users from API
        const tokenUsersFromApi = apiData.recent_token_users.map((user, index) => ({
          id: index + 1,
          name: user.name,
          email: user.email,
          tokensUsed: user.tokens_used,
          avatar: `https://placehold.co/34x34/8B5CF6/FFFFFF?text=${user.name.split(' ').map(n => n[0]).join('').toUpperCase()}`,
        }));

        setRecentSubscribers(subscribersFromApi);
        setRecentTokenUsers(tokenUsersFromApi);
      } catch (error) {
        console.error("Error fetching data:", error);
        
        // Fallback data if API fails
        setRecentSubscribers([
          {
            id: 1,
            name: 'Alex Manda',
            email: 'alex@example.com',
            time: 'Today, 16:36',
            avatar: 'https://placehold.co/34x34/60A5FA/FFFFFF?text=AM',
          },
          {
            id: 2,
            name: 'Jane Doe',
            email: 'jane@example.com',
            time: 'Yesterday, 10:00',
            avatar: 'https://placehold.co/34x34/F87171/FFFFFF?text=JD',
          }
        ]);

        setRecentTokenUsers([
          {
            id: 1,
            name: 'John Smith',
            email: 'john@example.com',
            tokensUsed: 1250,
            avatar: 'https://placehold.co/34x34/34D399/FFFFFF?text=JS',
          },
          {
            id: 2,
            name: 'Maria Garcia',
            email: 'maria@example.com',
            tokensUsed: 890,
            avatar: 'https://placehold.co/34x34/FBBF24/FFFFFF?text=MG',
          }
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleSubscriber = () => {
    router.push("/admin/earning");
  };

  const handleTokenUser = () => {
    router.push("/admin/tokens"); // Navigate to token users page
  };

  // Toggle functions
  const handleViewAllSubscribersClick = () => {
    setShowAllSubscribers(!showAllSubscribers);
  };

  const handleViewAllTokenUsersClick = () => {
    setShowAllTokenUsers(!showAllTokenUsers);
  };

  // Determine which lists to display
  const subscribersToShow = showAllSubscribers ? recentSubscribers : recentSubscribers.slice(0, 3);
  const tokenUsersToShow = showAllTokenUsers ? recentTokenUsers : recentTokenUsers.slice(0, 3);

  if (loading) {
    return (
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="w-full px-6 py-6 bg-white rounded-lg shadow-xl flex items-center justify-center">
          <div className="text-gray-500">Loading subscribers...</div>
        </div>
        <div className="w-full px-6 py-6 bg-white rounded-lg shadow-xl flex items-center justify-center">
          <div className="text-gray-500">Loading token users...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Subscribers Card */}
      <div className="w-full px-6 py-6 bg-white rounded-lg shadow-xl flex flex-col justify-start items-start gap-3">
        {/* Card Title */}
        <div className="self-stretch flex justify-between items-center">
          <div className="text-black text-xl font-semibold leading-loose">
            Recent Subscribers
          </div>
          {recentSubscribers.length > 3 && (
            <button
              onClick={handleViewAllSubscribersClick}
              className="text-blue-500 text-sm font-medium hover:text-blue-600 transition-colors"
            >
              {showAllSubscribers ? 'View Less' : 'View All'}
            </button>
          )}
        </div>

        {/* Subscriber List */}
        <div className={`self-stretch flex flex-col justify-start items-start gap-1.5 ${showAllSubscribers ? 'h-52 overflow-y-auto scrollbar-hide' : ''}`}>
          {subscribersToShow.map((subscriber) => (
            <div
              key={subscriber.id}
              className="self-stretch py-2 border-b border-gray-200 flex justify-start items-center gap-12 hover:bg-gray-50 cursor-pointer transition-colors"
              // onClick={handleSubscriber}
            >
              <div className="flex-1 flex justify-start items-center gap-3">
                <AvatarImage
                  src={subscriber.avatar}
                  alt={subscriber.name}
                  fallbackText={subscriber.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                />
                <div className="flex-1 flex flex-col justify-start items-start">
                  <div className="text-black text-sm font-semibold leading-normal">
                    {subscriber.name}
                  </div>
                  <div className="self-stretch text-gray-500 text-xs font-medium leading-tight">
                    {subscriber.email}
                  </div>
                </div>
                <div className="text-gray-400 text-xs">
                  {subscriber.time}
                </div>
              </div>
            </div>
          ))}
          {subscribersToShow.length === 0 && (
            <div className="self-stretch py-4 text-center text-gray-500 text-sm">
              No recent subscribers
            </div>
          )}
        </div>
      </div>

      {/* Recent Token Users Card */}
      <div className="w-full px-6 py-6 bg-white rounded-lg shadow-xl flex flex-col justify-start items-start gap-3">
        {/* Card Title */}
        <div className="self-stretch flex justify-between items-center">
          <div className="text-black text-xl font-semibold leading-loose">
            Recent Token Users
          </div>
          {recentTokenUsers.length > 3 && (
            <button
              onClick={handleViewAllTokenUsersClick}
              className="text-purple-500 text-sm font-medium hover:text-purple-600 transition-colors"
            >
              {showAllTokenUsers ? 'View Less' : 'View All'}
            </button>
          )}
        </div>

        {/* Token Users List */}
        <div className={`self-stretch flex flex-col justify-start items-start gap-1.5 ${showAllTokenUsers ? 'h-52 overflow-y-auto scrollbar-hide' : ''}`}>
          {tokenUsersToShow.map((user) => (
            <div
              key={user.id}
              className="self-stretch py-2 border-b border-gray-200 flex justify-start items-center gap-12 hover:bg-gray-50 cursor-pointer transition-colors"
              // onClick={handleTokenUser}
            >
              <div className="flex-1 flex justify-start items-center gap-3">
                <AvatarImage
                  src={user.avatar}
                  alt={user.name}
                  fallbackText={user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                />
                <div className="flex-1 flex flex-col justify-start items-start">
                  <div className="text-black text-sm font-semibold leading-normal">
                    {user.name}
                  </div>
                  <div className="self-stretch text-gray-500 text-xs font-medium leading-tight">
                    {user.email}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-purple-600 text-sm font-semibold">
                    {user.tokensUsed.toLocaleString()}
                  </div>
                  <div className="text-gray-400 text-xs">
                    tokens
                  </div>
                </div>
              </div>
            </div>
          ))}
          {tokenUsersToShow.length === 0 && (
            <div className="self-stretch py-4 text-center text-gray-500 text-sm">
              No recent token users
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentSubscribersAndTokenUsers;