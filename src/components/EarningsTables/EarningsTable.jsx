"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

// Dummy data updated to match the new structure with monthly and yearly plans
const dummyData = Array.from({ length: 50 }).map((_, i) => ({
  id: 1001 + i,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  phone: `555-010${i % 10}-00${i % 9}`,
  // Assign subscription plans as either "Monthly" or "Yearly"
  subscriptionPlan: i % 2 === 0 ? "Monthly" : "Yearly",
  // Adjust price based on the plan type
  price: i % 2 === 0 ? (10 + i * 0.5).toFixed(2) : (100 + i * 5).toFixed(2),
  joinDate: `${(i % 28) + 1} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'][i % 8]} 2024`,
}));

export default function EarningsTable() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  // State for subscription plan filter, now including "Monthly" and "Yearly"
  const [planFilter, setPlanFilter] = useState("All");

  // Memoized filtering logic for search and subscription plan
  const filteredData = useMemo(() => {
    return dummyData.filter(item => {
      const searchLower = searchQuery.toLowerCase();
      const searchMatch =
        item.name.toLowerCase().includes(searchLower) ||
        item.email.toLowerCase().includes(searchLower) ||
        item.phone.includes(searchQuery);

      // Filter logic now checks for "Monthly" or "Yearly"
      const planMatch = planFilter === "All" || item.subscriptionPlan === planFilter;

      return searchMatch && planMatch;
    });
  }, [searchQuery, planFilter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle changes and reset to the first page
  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setCurrentPage(1);
  };

  const handleViewDetails = (id) => {
    router.push(`/admin/earning/${id}`);
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-white text-black">
      {/* Earnings Overview Card */}
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
            placeholder="Search by Name, Email, Phone..."
            value={searchQuery}
            onChange={handleFilterChange(setSearchQuery)}
            className="w-full sm:w-80 pl-4 pr-10 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
           <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <div className="relative w-full sm:w-auto">
          <select
            value={planFilter}
            onChange={handleFilterChange(setPlanFilter)}
            className="w-full appearance-none pl-4 pr-10 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Plans</option>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
           <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
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
            {paginatedData.map((item) => (
              <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                <td className="py-3 px-4 font-medium">#{item.id}</td>
                <td className="py-3 px-4">
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.email}</div>
                    <div className="text-xs text-gray-500">{item.phone}</div>
                </td>
                <td className="py-3 px-4">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${item.subscriptionPlan === "Monthly" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>
                        {item.subscriptionPlan}
                    </span>
                </td>
                <td className="py-3 px-4 font-mono">${item.price}</td>
                <td className="py-3 px-4">{item.joinDate}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleViewDetails(item.id)}
                    className="text-orange-500 hover:text-orange-600 transition-colors duration-200"
                    aria-label={`View details for ${item.name}`}
                    title="View Details"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                  </button>
                </td>
              </tr>
            ))}
             {paginatedData.length === 0 && (
                <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">No records found.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row justify-end items-center mt-6 text-black text-sm">
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg bg-gray-100 border border-gray-300 disabled:opacity-50 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Previous page"
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1.5 rounded-lg ${
                currentPage === i + 1
                  ? "bg-[#013D3B] text-white font-bold"
                  : "bg-gray-100 border border-gray-300 hover:bg-gray-200"
              } transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500`}
              aria-label={`Page ${i + 1}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-lg bg-gray-100 border border-gray-300 disabled:opacity-50 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Next page"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
