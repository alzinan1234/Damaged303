// src/app/earnings/[id]/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { motion } from "framer-motion"; // Only motion is needed, AnimatePresence is for conditional rendering within one component

// Dummy data for demonstration (ideally, this would be fetched from an API)
const dummyData = Array.from({ length: 50 }).map((_, i) => ({
  id: i + 1, // Add a unique ID for better keying
  name: `Robert ${i + 1}`,
  itemNumber: `#A${12345 + i}`,
  salePrice: `$${(123 + i * 0.5).toFixed(2)}`,
  commission: `${(10 + i % 5)}%`,
  profit: `${(80 + i * 0.2).toFixed(2)}`,
  date: `12 June 2025`,
  description: `Detailed description for item #A${12345 + i}. This item was sold on 12 June 2025, generating a significant profit. Buyer: Customer ${i % 10 + 1}, Payment Method: Card ending in **** ${1234 + i % 100}.`,
  buyer: `Customer ${i % 10 + 1}`,
  paymentMethod: `Card ending in **** ${1234 + i % 100}`,
}));

export default function EarningDetailsPage({ params }) {
  const router = useRouter();
  const earningId = params.id; // Get the ID from the URL params

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
          const foundItem = dummyData.find(item => item.id === Number(earningId));

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
        <button
          onClick={() => router.back()}
          className="px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!earningDetails) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black p-4">
        <p className="mb-4">Earning record not found for ID: {earningId}.</p>
        <button
          onClick={() => router.back()}
          className="px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black"
        >
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
            <span className="text-xs text-gray-500">Name</span>
            <span className="text-lg font-semibold text-gray-800">{earningDetails.name}</span>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-1 shadow-sm">
            <span className="text-xs text-gray-500">Item Number</span>
            <span className="text-lg font-semibold text-gray-800">{earningDetails.itemNumber}</span>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-1 shadow-sm">
            <span className="text-xs text-gray-500">Sale Price</span>
            <span className="text-lg font-semibold text-gray-800">{earningDetails.salePrice}</span>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-1 shadow-sm">
            <span className="text-xs text-gray-500">Commission</span>
            <span className="text-lg font-semibold text-gray-800">{earningDetails.commission}</span>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-1 shadow-sm">
            <span className="text-xs text-gray-500">Seller's Profit</span>
            <span className="text-lg font-semibold text-gray-800">{earningDetails.profit}</span>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-1 shadow-sm">
            <span className="text-xs text-gray-500">Transaction Date</span>
            <span className="text-lg font-semibold text-gray-800">{earningDetails.date}</span>
          </div>
        </div>
        <div className="mb-8 bg-gray-50 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-gray-500">Description</span>
          <p className="text-base text-gray-700 mt-1">{earningDetails.description}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-1 shadow-sm">
            <span className="text-xs text-gray-500">Buyer</span>
            <span className="text-base font-medium text-gray-800">{earningDetails.buyer}</span>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-1 shadow-sm">
            <span className="text-xs text-gray-500">Payment Method</span>
            <span className="text-base font-medium text-gray-800">{earningDetails.paymentMethod}</span>
          </div>
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