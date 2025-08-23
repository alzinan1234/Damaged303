// components/DashboardCards.js
"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MetricCard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalEarnings: 0,
    totalUsers: 0,
    totalTokens: 0,
    totalProducts: 0, // Will be 0 until API adds this field
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("https://maintains-usb-bell-with.trycloudflare.com/api/dashboard/overview/");
        const apiData = response.data.data;

        setDashboardData({
          totalEarnings: apiData.total_earnings || 0,
          totalUsers: apiData.total_users || 0,
          totalTokens: apiData.total_tokens_used || 0,
          totalProducts: apiData.total_affiliate_products || 0, // Future API field
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Fallback to demo data if API fails
        setDashboardData({
          totalEarnings: 682.5,
          totalUsers: 68,
          totalTokens: 1240,
          totalProducts: 25,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    
    // Auto-refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Format numbers with commas
  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row gap-4 p-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="flex-1 bg-white rounded p-6 shadow-xl animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
                <div className="h-8 bg-gray-300 rounded w-16"></div>
              </div>
              <div className="bg-gray-300 rounded-full w-12 h-12"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      {/* Total Earning Card */}
      <div className="flex-1 bg-white rounded p-6 flex items-center justify-between shadow-xl hover:shadow-2xl transition-shadow duration-300">
        <div>
          <p className="text-black text-sm font-normal">Total Earning</p>
          <h2 className="text-black text-3xl font-bold mt-1">
            {formatCurrency(dashboardData.totalEarnings)}
          </h2>
        </div>
        <div className="bg-[#013D3B] text-white rounded-full p-3 flex items-center justify-center w-12 h-12">
          {/* Chart Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="white">
            <path d="M7 18h2V6H7v12zm4-12h2v16h-2V6zm4 8h2v8h-2v-8z"/>
          </svg>
        </div>
      </div>

      {/* Total User Card */}
      <div className="flex-1 bg-white rounded p-6 flex items-center justify-between shadow-xl hover:shadow-2xl transition-shadow duration-300">
        <div>
          <p className="text-black text-sm">Total Users</p>
          <h2 className="text-black text-3xl font-bold mt-1">
            {formatNumber(dashboardData.totalUsers)}
          </h2>
        </div>
        <div className="bg-[#013D3B] rounded-full p-3 flex items-center justify-center w-12 h-12">
          {/* User Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 24 18" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M16.6959 10.187C18.135 11.1639 19.1434 12.4874 19.1434 14.2521V17.4034H22.2946C22.8724 17.4034 23.3451 16.9307 23.3451 16.353V14.2521C23.3451 11.9622 19.5951 10.6072 16.6959 10.187Z" fill="white" />
            <path d="M8.63929 9.00001C10.9598 9.00001 12.841 7.11886 12.841 4.79835C12.841 2.47783 10.9598 0.59668 8.63929 0.59668C6.31877 0.59668 4.43762 2.47783 4.43762 4.79835C4.43762 7.11886 6.31877 9.00001 8.63929 9.00001Z" fill="white" />
            <path fillRule="evenodd" clipRule="evenodd" d="M14.9417 9.00001C17.2632 9.00001 19.1434 7.11977 19.1434 4.79835C19.1434 2.47693 17.2632 0.59668 14.9417 0.59668C14.448 0.59668 13.9859 0.701721 13.5447 0.848779C14.4165 1.93071 14.9417 3.30675 14.9417 4.79835C14.9417 6.28994 14.4165 7.66598 13.5447 8.74791C13.9859 8.89497 14.448 9.00001 14.9417 9.00001Z" fill="white" />
            <path fillRule="evenodd" clipRule="evenodd" d="M8.63929 10.0503C5.83468 10.0503 0.235962 11.4579 0.235962 14.252V16.3528C0.235962 16.9305 0.708649 17.4032 1.28638 17.4032H15.9922C16.5699 17.4032 17.0426 16.9305 17.0426 16.3528V14.252C17.0426 11.4579 11.4439 10.0503 8.63929 10.0503Z" fill="white" />
          </svg>
        </div>
      </div>

      {/* Total Token Card */}
      <div className="flex-1 bg-white rounded p-6 flex items-center justify-between shadow-xl hover:shadow-2xl transition-shadow duration-300">
        <div>
          <p className="text-black text-sm">Total Tokens</p>
          <h2 className="text-black text-3xl font-bold mt-1">
            {formatNumber(dashboardData.totalTokens)}
          </h2>
        </div>
        <div className="bg-[#013D3B] rounded-full p-3 flex items-center justify-center w-12 h-12">
          {/* Token Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="white">
            <path d="M12,2C6.486,2,2,6.486,2,12s4.486,10,10,10s10-4.486,10-10S17.514,2,12,2z M12,20c-4.411,0-8-3.589-8-8s3.589-8,8-8 s8,3.589,8,8S16.411,20,12,20z"></path>
            <path d="M13.842 14.418H10.158l-1.334 2.667H6l6-12l6 12h-2.824L13.842 14.418zM12 7.168L10.511 10.13h2.978L12 7.168z"></path>
          </svg>
        </div>
      </div>

      {/* Total Affiliate Products Card */}
      <div className="flex-1 bg-white rounded p-6 flex items-center justify-between shadow-xl hover:shadow-2xl transition-shadow duration-300">
        <div>
          <p className="text-black text-sm">Total Products</p>
          <h2 className="text-black text-3xl font-bold mt-1">
            {formatNumber(dashboardData.totalProducts)}
          </h2>
        </div>
        <div className="bg-[#013D3B] rounded-full p-3 flex items-center justify-center w-12 h-12">
          {/* Affiliate Products Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="white">
            <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/>
            <path d="M9 8V17H11V8H9ZM13 8V17H15V8H13Z"/>
            <circle cx="12" cy="12" r="2" fill="#013D3B"/>
            <path d="M16.5 7.5L18.5 5.5M18.5 5.5L20.5 7.5M18.5 5.5V9.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;