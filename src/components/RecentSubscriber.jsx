"use client";

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

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

// Main component for the Recent Subscribers card
const RecentSubscriber = () => {

    const router = useRouter();

  const handleSubscriber = () => {
    router.push("/admin/earning"); // Navigate to subscriber details page
   
    // Navigate to subscriber details page
    // Placeholder for any action when the subscriber is clicked
    
  }
  // State to manage whether to show all subscribers or a limited list
  const [showAll, setShowAll] = useState(false);

  // Function to toggle the 'showAll' state when the 'View all' button is clicked
  const handleViewAllClick = () => {
    setShowAll(!showAll);
  };

  // Sample data for recent subscribers. Added more for demonstration purposes.
  const subscribers = [
    {
      id: 1,
      name: 'Alex Manda',
      time: 'Today, 16:36',
      avatar: 'https://placehold.co/34x34/60A5FA/FFFFFF?text=AM',
    },
    {
      id: 2,
      name: 'Jane Doe',
      time: 'Yesterday, 10:00',
      avatar: 'https://placehold.co/34x34/F87171/FFFFFF?text=JD',
    },
    {
      id: 3,
      name: 'John Smith',
      time: '2 days ago, 09:15',
      avatar: 'https://placehold.co/34x34/34D399/FFFFFF?text=JS',
    },
    {
      id: 4,
      name: 'Maria Garcia',
      time: '3 days ago, 12:30',
      avatar: 'https://placehold.co/34x34/FBBF24/FFFFFF?text=MG',
    },
    {
      id: 5,
      name: 'Sam Wilson',
      time: '4 days ago, 14:00',
      avatar: 'https://placehold.co/34x34/8B5CF6/FFFFFF?text=SW',
    },
    {
      id: 6,
      name: 'Emily Davis',
      time: '1 week ago, 08:45',
      avatar: 'https://placehold.co/34x34/EC4899/FFFFFF?text=ED',
    },
    {
      id: 7,
      name: 'Chris Lee',
      time: '1 week ago, 11:20',
      avatar: 'https://placehold.co/34x34/10B981/FFFFFF?text=CL',
    },
    {
      id: 8,
      name: 'Patricia Jones',
      time: '1 week ago, 15:55',
      avatar: 'https://placehold.co/34x34/F97316/FFFFFF?text=PJ',
    },
  ];

  // Determine which list to display: the full list or the first 3
  const subscribersToShow = showAll ? subscribers : subscribers.slice(0, 3);

  return (
    <div className="w-full px-6 py-6 bg-white rounded-lg shadow-xl flex flex-col justify-start items-start gap-3">
      {/* Card Title */}
      <div className="self-stretch text-black text-xl font-semibold leading-loose">
        Recent Subscriber
      </div>

      {/* Subscriber List */}
      {/* The container below is now scrollable with a hidden scrollbar */}
      <div className={`self-stretch flex flex-col justify-start items-start gap-1.5 ${showAll ? 'h-52 overflow-y-auto scrollbar-hide' : ''}`}>
        {subscribersToShow.map((subscriber) => (
          <div
            key={subscriber.id}
            className="self-stretch py-2 border-b border-gray-200 flex justify-start items-center gap-12"
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
                  {subscriber.time}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View all button - only show if there are more than 3 subscribers and 'showAll' is false */}
      {/* {!showAll && subscribers.length > 3 && ( */}
        <button
          className="inline-flex justify-end items-center gap-[5px] cursor-pointer focus:outline-none"
          onClick={handleSubscriber}
        >
          <div className="text-black text-base font-semibold leading-7 flex items-center justify-end">
            View all
          </div>
          {/* Arrow Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
            <g clipPath="url(#clip0_0_665)">
              <path d="M3 13.2102L17.17 13.2102L13.59 16.8002L15 18.2102L21 12.2102L15 6.2102L13.59 7.6202L17.17 11.2102L3 11.2102L3 13.2102Z" fill="black" />
            </g>
            <defs>
              <clipPath id="clip0_0_665">
                <rect width="24" height="24" fill="white" transform="translate(24 24.2102) rotate(-180)" />
              </clipPath>
            </defs>
          </svg>
        </button>
      {/* )} */}
    </div>
  );
};

export default RecentSubscriber;
