"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter

// Dummy data for demonstration
const dummyData = Array.from({ length: 50 }).map((_, i) => ({
  id: i + 1, // Add a unique ID for better keying
  name: `Robert ${i + 1}`,
  itemNumber: `#A${12345 + i}`,
  salePrice: `$${(123 + i * 0.5).toFixed(2)}`,
  commission: `${(10 + i % 5)}%`,
  profit: `${(80 + i * 0.2).toFixed(2)}`,
  date: `12 June 2025`, // Keeping date static for simplicity
}));

export default function EarningsTable() {
  const router = useRouter(); // Initialize useRouter
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // State for items per page

  const totalPages = Math.ceil(dummyData.length / itemsPerPage);
  const paginatedData = dummyData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle change in items per page dropdown
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  // Handle click on the view icon
  const handleViewDetails = (id) => {
    router.push(`/admin/earning/${id}`); // Navigate to the dynamic details page
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-white text-black">
      {/* Earnings Overview Card */}
      <h2 className="text-black text-xl font-semibold mb-4">Earning Overview</h2>
      <div className="bg-[#013D3B] rounded p-4 mb-6 w-full md:w-[709px] shadow-lg">
        <div className="text-[#ffffff] text-md font-medium">Total Earning</div>
        <div className="text-4xl font-bold text-[#ffffff]">$25,215</div>
      </div>

      {/* Earnings Table */}
      <div className="bg-white rounded p-4 sm:p-6 shadow-xl overflow-x-auto border border-gray-200">
        <table className="w-full text-sm text-black table-auto">
          <thead className="text-left bg-gray-100">
            <tr>
              <th className="py-3 px-4 rounded-tl-lg ">Serial</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Item Number</th>
              <th className="py-3 px-4">Sale Price</th>
              <th className="py-3 px-4">Commission %</th>
              <th className="py-3 px-4">Seller's Profit</th>
              <th className="py-3 px-4">Transaction Date</th>
              <th className="py-3 px-4 rounded-tr-lg">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, idx) => (
              <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                <td className="py-2 px-4">
                  {(currentPage - 1) * itemsPerPage + idx + 1}
                </td>
                <td className="py-2 px-4">{item.name}</td>
                <td className="py-2 px-4">{item.itemNumber}</td>
                <td className="py-2 px-4">{item.salePrice}</td>
                <td className="py-2 px-4">{item.commission}</td>
                <td className="py-2 px-4">{item.profit}</td>
                <td className="py-2 px-4">{item.date}</td>
                <td className="py-2 px-4">
                  {/* View Icon */}
                  <button
                    onClick={() => handleViewDetails(item.id)} // Call handler on click
                    className="text-orange-400 hover:text-orange-500 transition-colors duration-200"
                    aria-label={`View details for ${item.name}`}
                    title="View Details"
                  >
                    <svg
                      className="h-5 w-5 cursor-pointer"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      ></path>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 text-black text-sm">
        {/* Items per page dropdown */}
        <div className="mb-4 sm:mb-0 ">
          Showing{" "}
          <select
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 text-black bg-white"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            aria-label="Items per page"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>{" "}
          of {dummyData.length} entries
        </div>

        {/* Page navigation buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg bg-gray-100 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
            aria-label="Previous page"
          >
            {"<"}
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1.5 rounded-lg ${
                currentPage === i + 1
                  ? "bg-[#013D3B] text-white font-bold"
                  : "bg-gray-100 border border-gray-300 hover:bg-gray-200"
              } transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400`}
              aria-label={`Page ${i + 1}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-lg bg-gray-100 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
            aria-label="Next page"
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
}