"use client";

import React, { useEffect, useState } from "react";
// We'll use a local function instead of next/navigation
import { motion, AnimatePresence } from "framer-motion";
// We'll use a standard <img> tag instead of next/image
import toast from "react-hot-toast";
import axios from "axios";

// This component displays the details for a specific user, found
// by their ID in the URL parameters. It fetches a list of subscriptions
// and finds the matching record to display.
export default function UserDetailsPage({ params }) {
  // Mock router for back functionality, as next/navigation is not available
  const router = {
    back: () => window.history.back(),
  };

  // The user ID is retrieved from the URL parameters.
  const userId = params.id;
  
  // State for user data, loading, and error handling.
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We use a self-invoking async function to fetch the data.
    async function fetchSubscriptionDetails() {
      setLoading(true);
      try {
        // The API endpoint provides a list of subscriptions.
        // We use axios to make the GET request.
        const response = await axios.get(
          "https://maintains-usb-bell-with.trycloudflare.com/api/dashboard/subscriptions/?search&plan_type&page"
        );
        
        const subscriptions = response.data.results;

        console.log("subscriptions"  ,subscriptions)
        
        // Find the specific subscription that matches the user ID from the URL.
        // We use parseInt because the ID from the URL is a string.
        const foundSubscription = subscriptions.find(
          (sub) => sub.id === parseInt(userId)
        );

        if (foundSubscription) {
          setUser(foundSubscription);
        } else {
          setUser(null);
        }
      } catch (err) {
        // Use react-hot-toast to display a user-friendly error message.
        toast.error("Could not fetch user details.");
        console.error("API Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSubscriptionDetails();
  }, [userId]); // The effect re-runs whenever the userId changes.

  // Conditional rendering for loading state, using a simple message.
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center text-black">
        Loading user details...
      </div>
    );
  }

  // Conditional rendering for when no user is found.
  if (!user) {
    return (
      <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center text-red-600">
        User not found.
      </div>
    );
  }

  // Main component render logic.
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 relative px-8 py-10 flex flex-col items-center"
          initial={{ scale: 0.95, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 40 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {/* Close button */}
          <button
            className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors duration-200"
            onClick={() => router.back()}
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
          
          {/* User profile image and info */}
          <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg mb-6 border-4 border-gray-100 bg-gray-50 flex items-center justify-center">
            <img
              src={"https://placehold.co/128x128/CCCCCC/000000?text=NA"}
              alt={user.name}
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight text-center">{user.subscription_plan_name}</h2>
          <p className="text-base text-gray-500 mb-4 text-center">User ID: <span className="font-bold text-gray-700">#{user.id}</span></p>

          {/* User details section */}
          <div className="w-full flex flex-col gap-3 mb-6">
            <div className="flex items-center gap-2 text-gray-700">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-7 6l-2 2-2-2m-8 6h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              <span>Email:</span>
              <span className="font-medium">{user.user_email}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              <span>Phone:</span>
              <span className="font-medium">{user.user_phone || "-"}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
              <span>Plan Type:</span>
              <span className="font-semibold text-sm text-blue-600">{user.plan_type}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              <span>Joined:</span>
              <span className="font-medium">{user.joined_date}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a5 5 0 00-10 0v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2z"></path></svg>
              <span>Price:</span>
              <span className="font-medium">${user.price}</span>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="w-full flex gap-4 mt-4">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold w-1/2 border border-gray-200 shadow-sm transition-colors duration-200"
            >
              Close
            </button>
            <button
              className={`px-4 py-2 rounded-lg w-1/2 font-semibold shadow-sm transition-colors duration-200 border ${user.status === 'Active' ? 'bg-red-500 hover:bg-red-600 text-white border-red-500' : 'bg-green-500 hover:bg-green-600 text-white border-green-500'}`}
            >
              {user.status === 'Active' ? 'Block Account' : 'Activate Account'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
