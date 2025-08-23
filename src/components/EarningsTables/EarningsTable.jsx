"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// This is the main component for the Earnings Table, which fetches
// and displays subscription data from an API.
export default function EarningsTable() {
  // useRouter hook is used for client-side navigation
  const router = useRouter(); // State hooks for managing the component's UI and data
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState("All");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0); // The API endpoint URL

  const API_URL =
    "https://maintains-usb-bell-with.trycloudflare.com/api/dashboard/subscriptions/";
  const itemsPerPage = 10; // Assuming a fixed page size of 10 from the API // useCallback memoizes the function to prevent unnecessary re-creations, // which helps optimize performance and avoids infinite loops with useEffect.

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true); // Start loading state
    setError(null); // Clear any previous errors

    try {
      // Construct the query parameters object for the API request
      const params = {
        page: currentPage,
        search: searchQuery,
      }; // Add the plan type filter if it's not "All"

      if (planFilter !== "All") {
        params.plan_type = planFilter;
      } // Make the GET request to the API using axios

      const response = await axios.get(API_URL, { params }); // Update the component state with the fetched data
      setData(response.data.results);
      setTotalCount(response.data.count);
    } catch (err) {
      // Handle any errors during the fetch operation
      setError("Failed to fetch data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false); // End loading state
    }
  }, [currentPage, searchQuery, planFilter]); // useEffect hook to trigger the data fetch when dependencies change

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]); // The dependency is the memoized function // Calculate the total number of pages based on the total count

  const totalPages = Math.ceil(totalCount / itemsPerPage); // This function handles changes for both search and filter inputs

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setCurrentPage(1); // Reset to the first page on any filter/search change
  }; // This function handles the "View Details" button click

  const handleViewDetails = (id) => {
    // Redirect to the details page for the specific item
    router.push(`/admin/earning/${id}`);
  }; // Helper function to convert the API's plan type to a readable format

  const getDisplayPlanName = (plan_type) => {
    if (plan_type && plan_type.includes("monthly")) {
      return "Monthly";
    } else if (plan_type && plan_type.includes("yearly")) {
      return "Yearly";
    }
    return "Unknown";
  }; // Conditional rendering for loading and error states

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-black">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  } // Main component render logic

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-white text-black">
      {/* Earnings Overview Card (hard-coded value) */}
      <h2 className="text-black text-xl font-semibold mb-4">Subscriber Overview</h2>
      <div className="bg-[#013D3B] rounded-lg p-6 mb-6 w-full max-w-2xl shadow-xl text-white">
        <div className="text-md font-medium opacity-80">Total Earning</div>
        <div className="text-4xl font-bold mt-1">$25,215</div>
      </div>
      {/* Filters Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by Email, Phone..."
            value={searchQuery}
            onChange={handleFilterChange(setSearchQuery)}
            className="w-full sm:w-80 pl-4 pr-10 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <div className="relative w-full sm:w-auto">
          <select
            value={planFilter}
            onChange={handleFilterChange(setPlanFilter)}
            className="w-full appearance-none pl-4 pr-10 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Plans</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <svg
            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>
      </div>
      {/* Earnings Table */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-xl overflow-x-auto border border-gray-200">
        <table className="w-full text-sm text-black table-auto">
          <thead className="text-left bg-gray-100">
            <tr>
              <th className="py-3 px-4 rounded-tl-lg">ID</th>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Subscription Plan</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Joined Date</th>
              <th className="py-3 px-4 rounded-tr-lg">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                <td className="py-3 px-4 font-medium">#{item.id}</td>
                <td className="py-3 px-4">
                  <div className="font-semibold">{item.user_email}</div>
                  <div className="text-xs text-gray-500">{item.user_email}</div>
                  <div className="text-xs text-gray-500">{item.user_phone || "N/A"}</div>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getDisplayPlanName(item.plan_type) === "Monthly" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>
                    {getDisplayPlanName(item.plan_type)}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono">${item.price}</td>
                <td className="py-3 px-4">{item.joined_date}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleViewDetails(item.id)}
                    className="text-orange-500 hover:text-orange-600 transition-colors duration-200"
                    aria-label={`View details for ${item.user_email}`}
                    title="View Details"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
                       {" "}
            {data.length === 0 && !loading && (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">No records found.</td>
              </tr>
            )}
                     {" "}
          </tbody>
                 {" "}
        </table>
             {" "}
      </div>
            {/* Pagination Controls */}     {" "}
      <div className="flex flex-col sm:flex-row justify-end items-center mt-6 text-black text-sm">
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg bg-gray-100 border border-gray-300 disabled:opacity-50 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Previous page"
          >&lt;</button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1.5 rounded-lg ${currentPage === i + 1 ? "bg-[#013D3B] text-white font-bold" : "bg-gray-100 border border-gray-300 hover:bg-gray-200"} transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500`}
              aria-label={`Page ${i + 1}`}
            >{i + 1}</button>
          ))}
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-lg bg-gray-100 border border-gray-300 disabled:opacity-50 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Next page"
          >&gt;</button>
        </div>
      </div>
    </div>
  );
}
