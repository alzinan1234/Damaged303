"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

// A client component for rendering avatars with a fallback
function AvatarImage({ src, alt }) {
  const [imgSrc, setImgSrc] = useState(src);
  return (
    <img
      className="h-full w-full object-cover"
      src={imgSrc}
      alt={alt}
      onError={() =>
        setImgSrc("https://placehold.co/40x40/CCCCCC/000000?text=NA")
      }
    />
  );
}

// Main UserList Component
export default function UserList() {
  const router = useRouter();

  // Initial user data updated with 'userType'
  const initialUsers = [
    {
      id: "5089",
      customer: {
        name: "Jane Cooper",
        avatar:
          "https://images.pexels.com/photos/1250655/pexels-photo-1250655.jpeg",
      },
      joinDate: "6 April, 2023",
      status: "Active",
      email: "jane.cooper@example.com",
      phone: "664-333-2244",
      userType: "Paid",
    },
    {
      id: "5090",
      customer: {
        name: "Jerome Bell",
        avatar: "https://placehold.co/40x40/33FF57/FFFFFF?text=JB",
      },
      joinDate: "15 May, 2023",
      status: "Blocked",
      email: "jerome.bell@example.com",
      phone: "123-456-7890",
      userType: "Freemium",
    },
    {
      id: "5091",
      customer: {
        name: "Jenny Wilson",
        avatar: "https://placehold.co/40x40/5733FF/FFFFFF?text=JW",
      },
      joinDate: "21 May, 2023",
      status: "Active",
      email: "jenny.wilson@example.com",
      phone: "987-654-3210",
      userType: "Paid",
    },
    {
      id: "5092",
      customer: {
        name: "Ralph Edwards",
        avatar: "https://placehold.co/40x40/FF33A1/FFFFFF?text=RE",
      },
      joinDate: "3 June, 2024",
      status: "Blocked",
      email: "ralph.edwards@example.com",
      phone: "555-123-4567",
      userType: "Freemium",
    },
    {
      id: "5093",
      customer: {
        name: "Alice Johnson",
        avatar: "https://placehold.co/40x40/33A1FF/FFFFFF?text=AJ",
      },
      joinDate: "7 June, 2024",
      status: "Active",
      email: "alice.j@example.com",
      phone: "111-222-3333",
      userType: "Paid",
    },
    {
      id: "5094",
      customer: {
        name: "Bob Williams",
        avatar: "https://placehold.co/40x40/A133FF/FFFFFF?text=BW",
      },
      joinDate: "12 July, 2024",
      status: "Blocked",
      email: "bob.w@example.com",
      phone: "444-555-6666",
      userType: "Freemium",
    },
  ];

  // State for all functionalities
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [userType, setUserType] = useState("All");
  const [filterMonth, setFilterMonth] = useState("All");
  const [filterYear, setFilterYear] = useState("All");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // State for the confirmation modal
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [userToUnblock, setUserToUnblock] = useState(null);

  // Helper to parse date string into a Date object
  const parseDate = (str) => {
    const [day, monthStr, year] = str.replace(",", "").split(" ");
    const monthIndex = new Date(`${monthStr} 1, 2000`).getMonth();
    return new Date(year, monthIndex, day);
  };

  // Memoize dynamic lists for filters to prevent recalculation on every render
  const { years, months } = useMemo(() => {
    const yearSet = new Set();
    const monthSet = new Set();
    initialUsers.forEach((u) => {
      const date = parseDate(u.joinDate);
      yearSet.add(date.getFullYear());
      monthSet.add(date.getMonth());
    });
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return {
      years: Array.from(yearSet).sort((a, b) => b - a),
      months: Array.from(monthSet)
        .sort((a, b) => a - b)
        .map((mIndex) => ({ value: mIndex, name: monthNames[mIndex] })),
    };
  }, [initialUsers]);

  // Filtered users based on all criteria
  const filtered = useMemo(() => {
    return users.filter((u) => {
      const searchTerm = search.toLowerCase();
      const searchMatch =
        u.customer.name.toLowerCase().includes(searchTerm) ||
        u.id.toLowerCase().includes(searchTerm) ||
        u.email.toLowerCase().includes(searchTerm) ||
        u.phone.replace(/-/g, "").includes(searchTerm.replace(/-/g, ""));

      const userTypeMatch = userType === "All" || u.userType === userType;

      const date = parseDate(u.joinDate);
      const monthMatch =
        filterMonth === "All" || date.getMonth() === parseInt(filterMonth);
      const yearMatch =
        filterYear === "All" || date.getFullYear() === parseInt(filterYear);

      return searchMatch && userTypeMatch && monthMatch && yearMatch;
    });
  }, [users, search, userType, filterMonth, filterYear]);

  // Pagination Logic
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  // -- Event Handlers --
  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  const handlePage = (p) => {
    if (p >= 1 && p <= totalPages) setPage(p);
  };

  const handleView = (user) => {
    router.push(`/admin/user-list/${user.id}`);
    toast.success(`Navigating to details for ${user.customer.name}`);
  };

  const handleBlockUnblock = (user) => {
    const newStatus = user.status === "Active" ? "Blocked" : "Active";
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
    );
    toast.success(`${user.customer.name} has been ${newStatus.toLowerCase()}!`);
    setShowConfirmation(false);
    setUserToUnblock(null);
  };

  const handleBlockUnblockClick = (user) => {
    if (user.status === "Blocked") {
      setUserToUnblock(user);
      setShowConfirmation(true);
    } else {
      handleBlockUnblock(user);
    }
  };

  const handleCancelUnblock = () => {
    setShowConfirmation(false);
    setUserToUnblock(null);
    toast("Unblock action cancelled.", { icon: "👋" });
  };

  return (
    <>
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold p-4 sm:p-6 text-black">
          User Management
        </h2>
      </div>

      {/* -- Filters Section -- */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 p-2">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by ID, Name, Email, Phone..."
            className="w-full pl-5 pr-10 py-2 rounded-lg border border-[#E9E7FD] bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={handleFilterChange(setSearch)}
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
        <div className="flex items-center gap-2">
          {/* User Type Filter */}
          <select
            value={userType}
            onChange={handleFilterChange(setUserType)}
            className="appearance-none text-gray-700 py-2 pl-3 pr-8 rounded-lg border border-[#E9E7FD] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All User Types</option>
            <option value="Freemium">Freemium</option>
            <option value="Paid">Paid</option>
          </select>
          {/* Month Filter */}
          <select
            value={filterMonth}
            onChange={handleFilterChange(setFilterMonth)}
            className="appearance-none text-gray-700 py-2 pl-3 pr-8 rounded-lg border border-[#E9E7FD] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Months</option>
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.name}
              </option>
            ))}
          </select>
          {/* Year Filter */}
          <select
            value={filterYear}
            onChange={handleFilterChange(setFilterYear)}
            className="appearance-none text-gray-700 py-2 pl-3 pr-8 rounded-lg border border-[#E9E7FD] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* -- User Table -- */}
      <div className="w-full text-black px-6 py-5 bg-white rounded-lg shadow-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-3 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-3 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-3 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-3 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Type
                </th>
                <th className="px-3 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">
                    No users found.
                  </td>
                </tr>
              ) : (
                paginated.map((user) => (
                  <tr key={user.id}>
                    <td className="px-3 py-4 sm:px-6 whitespace-nowrap text-sm font-medium text-gray-700">
                      #{user.id}
                    </td>
                    <td className="px-3 py-4 sm:px-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
                          <AvatarImage
                            src={user.customer.avatar}
                            alt={user.customer.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-800">
                            {user.customer.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {user.email}
                          </div>
                          <div className="text-xs text-gray-500">
                            {user.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 sm:px-6 whitespace-nowrap text-sm text-gray-700">
                      {user.joinDate}
                    </td>
                    <td className="px-3 py-4 sm:px-6 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.userType === "Paid"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {user.userType}
                      </span>
                    </td>
                    <td className="px-3 py-4 sm:px-6 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-3 py-4 sm:px-6 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleView(user)}
                          title="View details"
                          className=" hover:text-orange-500"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="21"
                            height="21"
                            viewBox="0 0 21 21"
                            fill="none"
                          >
                            <rect
                              x="0.600098"
                              y="0.209961"
                              width="20"
                              height="20"
                              rx="10"
                              fill="#FA8600"
                              fill-opacity="0.1"
                            />
                            <circle
                              cx="10.6001"
                              cy="10.21"
                              r="2.83333"
                              stroke="#FFAE47"
                            />
                            <path
                              d="M17.2799 9.14995C17.6713 9.61236 17.867 9.84357 17.867 10.21C17.867 10.5764 17.6713 10.8076 17.2799 11.27C16.0377 12.7376 13.5128 15.21 10.6001 15.21C7.68742 15.21 5.16254 12.7376 3.92029 11.27C3.5289 10.8076 3.3332 10.5764 3.3332 10.21C3.3332 9.84357 3.5289 9.61236 3.92029 9.14995C5.16254 7.68229 7.68742 5.20996 10.6001 5.20996C13.5128 5.20996 16.0377 7.68229 17.2799 9.14995Z"
                              stroke="#FFAE47"
                            />
                          </svg>
                        </button>
                        {user.status === "Active" ? (
                          <button
                            onClick={() => handleBlockUnblockClick(user)}
                            title="Block user"
                            className=" hover:text-red-600"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="15"
                              height="15"
                              viewBox="0 0 15 15"
                              fill="none"
                            >
                              <g clip-path="url(#clip0_0_698)">
                                <path
                                  d="M7.6001 0.209961C3.75283 0.209961 0.600098 3.3627 0.600098 7.20996C0.600098 11.0572 3.75283 14.21 7.6001 14.21C11.4474 14.21 14.6001 11.0572 14.6001 7.20996C14.6001 3.3627 11.4474 0.209961 7.6001 0.209961ZM2.26807 7.20996C2.26807 4.27321 4.66335 1.87793 7.6001 1.87793C8.70749 1.87793 9.77395 2.22243 10.6845 2.87048L7.6001 5.95486L3.26067 10.2943C2.61257 9.38376 2.26807 8.31736 2.26807 7.20996ZM7.6001 12.542C6.4927 12.542 5.42624 12.1974 4.51572 11.5494L11.9396 4.12556C12.5876 5.03611 12.9321 6.10251 12.9321 7.20996C12.9321 10.1467 10.5368 12.542 7.6001 12.542Z"
                                  fill="#FF3636"
                                />
                                <path
                                  d="M14.6001 7.20996C14.6001 11.0572 11.4474 14.21 7.6001 14.21V12.542C10.5368 12.542 12.9321 10.1467 12.9321 7.20996C12.9321 6.10251 12.5876 5.03611 11.9395 4.12559L7.6001 8.46501V5.95486L10.6845 2.87048C9.77395 2.22243 8.70749 1.87793 7.6001 1.87793V0.209961C11.4474 0.209961 14.6001 3.3627 14.6001 7.20996Z"
                                  fill="#F40000"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_0_698">
                                  <rect
                                    width="14"
                                    height="14"
                                    fill="white"
                                    transform="translate(0.600098 0.209961)"
                                  />
                                </clipPath>
                              </defs>
                            </svg>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBlockUnblockClick(user)}
                            title="Unblock user"
                            className="text-gray-500 hover:text-green-600"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="15"
                              height="15"
                              viewBox="0 0 15 15"
                              fill="none"
                            >
                              <g clip-path="url(#clip0_0_717)">
                                <path
                                  d="M11.5376 5.35059H5.73971V3.10211C5.73971 2.11046 6.57383 1.30371 7.59909 1.30371C8.62434 1.30371 9.45846 2.11046 9.45846 3.10211V4.14746H10.5522V3.10211C10.5522 1.50737 9.22743 0.209961 7.59909 0.209961C5.97074 0.209961 4.64596 1.50737 4.64596 3.10211V5.35059H3.6626C2.75796 5.35059 2.02197 6.08657 2.02197 6.99121V12.5693C2.02197 13.474 2.75796 14.21 3.6626 14.21H11.5376C12.4422 14.21 13.1782 13.474 13.1782 12.5693V6.99121C13.1782 6.08657 12.4422 5.35059 11.5376 5.35059ZM12.0845 12.5693C12.0845 12.8709 11.8391 13.1162 11.5376 13.1162H3.6626C3.36105 13.1162 3.11572 12.8709 3.11572 12.5693V6.99121C3.11572 6.68966 3.36105 6.44434 3.6626 6.44434H11.5376C11.8391 6.44434 12.0845 6.68966 12.0845 6.99121V12.5693Z"
                                  fill="#44E244"
                                />
                                <path
                                  d="M7.6001 8.03027C7.04133 8.03027 6.58838 8.48322 6.58838 9.04199C6.58838 9.39877 6.77322 9.71219 7.05221 9.89233V11.0928C7.05221 11.3948 7.29705 11.6396 7.59909 11.6396C7.9011 11.6396 8.14596 11.3948 8.14596 11.0928V9.89361C8.42607 9.71369 8.61182 9.39965 8.61182 9.04199C8.61182 8.48322 8.15887 8.03027 7.6001 8.03027Z"
                                  fill="#44E244"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_0_717">
                                  <rect
                                    width="14"
                                    height="14"
                                    fill="white"
                                    transform="translate(0.600098 0.209961)"
                                  />
                                </clipPath>
                              </defs>
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* -- Pagination Controls -- */}
      <div className="flex items-center justify-end p-4 sm:p-6">
        <div className="flex items-center space-x-2">
          <button
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-200 disabled:opacity-50"
            onClick={() => handlePage(page - 1)}
            disabled={page === 1}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                p === page
                  ? "bg-[#013D3B] text-white"
                  : "bg-gray-200 text-black hover:bg-gray-300"
              }`}
              onClick={() => handlePage(p)}
            >
              {p}
            </button>
          ))}
          <button
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-200 disabled:opacity-50"
            onClick={() => handlePage(page + 1)}
            disabled={page === totalPages}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* -- Confirmation Modal for Unblock -- */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full text-center"
            >
              <h3 className="text-xl font-semibold mb-4 text-black">
                Confirm Action
              </h3>
              {userToUnblock && (
                <p className="text-gray-700 mb-6">
                  Are you sure you want to unblock {userToUnblock.customer.name}
                  ?
                </p>
              )}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleCancelUnblock}
                  className="px-6 py-2 rounded-lg text-gray-700 border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleBlockUnblock(userToUnblock)}
                  className="px-6 py-2 rounded-lg bg-[#4CAF50] text-white hover:bg-[#45A049] focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Toaster position="top-right" />
    </>
  );
}
