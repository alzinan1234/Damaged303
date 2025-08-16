// src/app/earnings/[id]/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// Use the same dummy data structure as the EarningsTable component
const dummyData = Array.from({ length: 50 }).map((_, i) => ({
  id: 1001 + i,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  phone: `555-010${i % 10}-00${i % 9}`,
  subscriptionPlan: i % 3 === 0 ? "Monthly" : "Yearly",
  price: (50 + i * 2.5).toFixed(2),
  joinDate: `${(i % 28) + 1} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'][i % 8]} 2024`,
}));

export default function EarningDetailsPage({ params }) {
  const router = useRouter();
  const earningId = Number(params.id); // Get the ID from the URL params and convert to a number
  const [earningDetails, setEarningDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (earningId) {
      const fetchDetails = async () => {
        try {
          setLoading(true);
          setError(null);
          
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 300));

          // Find the item from dummyData based on the ID
          const foundItem = dummyData.find(item => item.id === earningId);

          if (foundItem) {
            setEarningDetails(foundItem);
          } else {
            setError('Earning record not found.');
          }
        } catch (err) {
          console.error("Failed to fetch earning details:", err);
          setError('Failed to load earning details.');
        } finally {
          setLoading(false);
        }
      };
      fetchDetails();
    }
  }, [earningId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-black">
        <p>Loading earning details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-red-500 p-4">
        <p className="mb-4">Error: {error}</p>
        <button onClick={() => router.back()} className="px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black">
          Go Back
        </button>
      </div>
    );
  }

  if (!earningDetails) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black p-4">
        <p className="mb-4">Earning record not found for ID: {earningId}.</p>
        <button onClick={() => router.back()} className="px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-white font-inter text-black p-4 sm:p-8 flex items-center justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-2xl w-full mx-auto bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Earning Details</h1>
          <button 
            onClick={() => router.back()} 
            className="text-gray-400 hover:text-red-500 transition-colors duration-200"
            aria-label="Go back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-1 shadow-sm">
            <span className="text-xs text-gray-500">User ID</span>
            <span className="text-lg font-semibold text-gray-800">#{earningDetails.id}</span>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-1 shadow-sm">
            <span className="text-xs text-gray-500">User Name</span>
            <span className="text-lg font-semibold text-gray-800">{earningDetails.name}</span>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-1 shadow-sm">
            <span className="text-xs text-gray-500">Email</span>
            <span className="text-lg font-semibold text-gray-800">{earningDetails.email}</span>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-1 shadow-sm">
            <span className="text-xs text-gray-500">Phone</span>
            <span className="text-lg font-semibold text-gray-800">{earningDetails.phone}</span>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-1 shadow-sm">
            <span className="text-xs text-gray-500">Subscription Plan</span>
            <span className="text-lg font-semibold text-gray-800">
              <span className={`px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${earningDetails.subscriptionPlan === "Paid" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"}`}>
                {earningDetails.subscriptionPlan}
              </span>
            </span>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-1 shadow-sm">
            <span className="text-xs text-gray-500">Price</span>
            <span className="text-lg font-semibold text-gray-800">${earningDetails.price}</span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 shadow-sm mb-8">
            <span className="text-xs text-gray-500">Joined Date</span>
            <p className="text-base font-semibold text-gray-800 mt-1">{earningDetails.joinDate}</p>
        </div>

        <button 
          onClick={() => router.back()} 
          className="mt-4 w-full px-6 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black shadow-md"
        >
          Go Back to List
        </button>
      </div>
    </motion.div>
  );
}