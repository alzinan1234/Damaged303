// components/RecentSubscriber.js
"use client";
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
const RecentSubscriber = () => {
  // Sample data for recent subscribers
  const subscribers = [
    {
      id: 1,
      name: 'Alex Manda',
      time: 'Today, 16:36',
      avatar: 'https://placehold.co/34x34/60A5FA/FFFFFF?text=AM', // Placeholder image URL
    },
    {
      id: 2,
      name: 'Jane Doe',
      time: 'Yesterday, 10:00',
      avatar: 'https://placehold.co/34x34/F87171/FFFFFF?text=JD', // Placeholder image URL
    },
    {
      id: 3,
      name: 'John Smith',
      time: '2 days ago, 09:15',
      avatar: 'https://placehold.co/34x34/34D399/FFFFFF?text=JS', // Placeholder image URL
    },
  ];

  return (
    <div className=" w-full px-6 py-6 bg-white rounded shadow-xl flex flex-col justify-start items-start gap-3">
      {/* Card Title */}
      <div className="self-stretch text-black text-xl font-semibold leading-loose">
        Recent Subscriber
      </div>

      {/* Subscriber List */}
      <div className="self-stretch flex flex-col justify-start items-end gap-3">
        <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
          {subscribers.map((subscriber) => (
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

        {/* View all button */}
        <button className="inline-flex justify-start items-center gap-[5px] cursor-pointer focus:outline-none">
          <div className="text-black text-base font-semibold leading-7">
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
      </div>
    </div>
  );
};

export default RecentSubscriber;