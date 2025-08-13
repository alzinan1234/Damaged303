// components/DashboardCards.js
import React from 'react';

const MetricCard = () => {
  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      {/* Total Earning Card */}
      <div className="flex-1 bg-white rounded p-6 flex items-center justify-between shadow-xl ">
        <div>
          <p className="text-black text-sm font-normal">Total Earning</p>
          <h2 className="text-black text-3xl font-bold mt-1">$682.5</h2>
        </div>
        <div className="bg-[#013D3B] text-white rounded-full p-3 flex items-center justify-center w-12 h-12">
          {/* You can replace this with an actual chart icon from a library like Heroicons */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
          <path style={{ fill: '#FFFF' }} d="M15 60h-5v4h44v-4H15zM22 47h20v4H22zM16 53v5h32v-5H16z" />
          <path d="M63 47H44v4h5a1 1 0 0 1 1 1v6h5a1 1 0 0 1 1 1v5h7a1 1 0 0 0 1-1V48a1 1 0 0 0-1-1zM14 52a1 1 0 0 1 1-1h5v-4H1a1 1 0 0 0-1 1v15a1 1 0 0 0 1 1h7v-5a1 1 0 0 1 1-1h5zM46 43v2h14v-2a1 1 0 0 0-1-1H47a1 1 0 0 0-1 1zM4 43v2h14v-2a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1zM60 27H46v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM18 27H4v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM49 32h8v8h-8zM7 32h8v8H7zM34 38a1 1 0 0 0-1-1v2a1 1 0 0 0 1-1zM30 34a1 1 0 0 0 1 1v-2a1 1 0 0 0-1 1z" style={{ fill: '#FFFF' }} />
          <path d="M41 36a9 9 0 1 0-9 9 9.01 9.01 0 0 0 9-9zm-10 5h-1a1 1 0 0 1 0-2h1v-2a3 3 0 0 1 0-6 1 1 0 0 1 2 0h1a1 1 0 0 1 0 2h-1v2a3 3 0 0 1 0 6 1 1 0 0 1-2 0z" style={{ fill: '#FFFF' }} />
          <circle cx="32" cy="11" r="2" style={{ fill: '#FFFF' }} />
          <path d="M32.51.14a.984.984 0 0 0-1.02 0L1.72 18h60.56zM32 15a4 4 0 1 1 4-4 4 4 0 0 1-4 4zM2 25h60a1 1 0 0 0 1-1v-4H1v4a1 1 0 0 0 1 1z" style={{ fill: '#FFFF' }} />
        </svg>
        </div>
      </div>

      {/* Total User Card */}
      <div className="flex-1 bg-white rounded p-6 flex items-center justify-between shadow-xl">
        <div>
          <p className="text-black text-sm">Total User</p>
          <h2 className="text-black text-3xl font-bold mt-1">68</h2>
        </div>
        <div className="bg-[#013D3B] rounded-full p-3 flex items-center justify-center w-12 h-12">
          {/* You can replace this with an actual user icon from a library like Heroicons */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 24 18" fill="none "stroke="#FFFFFF ">
            <path fillRule="evenodd" clipRule="evenodd" d="M16.6959 10.187C18.135 11.1639 19.1434 12.4874 19.1434 14.2521V17.4034H22.2946C22.8724 17.4034 23.3451 16.9307 23.3451 16.353V14.2521C23.3451 11.9622 19.5951 10.6072 16.6959 10.187Z" fill="white" />
            <path d="M8.63929 9.00001C10.9598 9.00001 12.841 7.11886 12.841 4.79835C12.841 2.47783 10.9598 0.59668 8.63929 0.59668C6.31877 0.59668 4.43762 2.47783 4.43762 4.79835C4.43762 7.11886 6.31877 9.00001 8.63929 9.00001Z" fill="white" />
            <path fillRule="evenodd" clipRule="evenodd" d="M14.9417 9.00001C17.2632 9.00001 19.1434 7.11977 19.1434 4.79835C19.1434 2.47693 17.2632 0.59668 14.9417 0.59668C14.448 0.59668 13.9859 0.701721 13.5447 0.848779C14.4165 1.93071 14.9417 3.30675 14.9417 4.79835C14.9417 6.28994 14.4165 7.66598 13.5447 8.74791C13.9859 8.89497 14.448 9.00001 14.9417 9.00001Z" fill="white" />
            <path fillRule="evenodd" clipRule="evenodd" d="M8.63929 10.0503C5.83468 10.0503 0.235962 11.4579 0.235962 14.252V16.3528C0.235962 16.9305 0.708649 17.4032 1.28638 17.4032H15.9922C16.5699 17.4032 17.0426 16.9305 17.0426 16.3528V14.252C17.0426 11.4579 11.4439 10.0503 8.63929 10.0503Z" fill="white" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;