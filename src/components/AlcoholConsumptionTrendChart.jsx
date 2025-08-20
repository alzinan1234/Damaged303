// components/AlcoholConsumptionTrendChart.js
"use client"; // Client component due to useState and chart rendering

import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'; // For the arrow icon

// Dummy data for the Alcohol Consumption Trend Line Chart
const alcoholData = [
  { name: 'Jan', consumption: 14000 },
  { name: 'Feb', consumption: 13500 },
  { name: 'Mar', consumption: 11000 },
  { name: 'Apr', consumption: 12000 },
  { name: 'May', consumption: 10500 },
  { name: 'Jun', consumption: 11500 },
  { name: 'Jul', consumption: 12500 },
  { name: 'Aug', consumption: 11000 },
  { name: 'Sep', consumption: 10000 },
  { name: 'Oct', consumption: 12000 },
  { name: 'Nov', consumption: 14500 },
  { name: 'Dec', consumption: 13000 },
];

const formatYAxisTick = (value) => {
  if (value === 0) return '0k'; // Simplified for clarity
  return `${value / 1000}k`;
};

// The component now accepts a 'title' prop
export default function AlcoholConsumptionTrendChart({ title = "Token Overview" }) {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const years = ['2024', '2023', '2022']; // Example years

  return (
    <div className="w-full h-full p-4 bg-white rounded flex flex-col justify-start items-center gap-5 shadow-xl">
      <div className="w-full flex justify-between items-center">
        <div className="flex-1 flex justify-between items-center">
          {/* The title is now dynamic */}
          <div className="text-black text-xl font-semibold font-['Roboto']">{title}</div>
          {/* Year Dropdown */}
          <div className="relative ml-4">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 px-3 py-1 bg-gray-100 border border-gray-300 rounded-full text-black text-sm font-semibold font-['DM Sans']"
            >
              <span>{selectedYear}</span>
              {isDropdownOpen ? (
                <ChevronUpIcon className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronDownIcon className="w-4 h-4 text-gray-600" />
              )}
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-24 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => {
                      setSelectedYear(year);
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-black hover:bg-gray-100 text-sm"
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full h-56"> {/* Fixed height for the chart */}
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={alcoholData}
            margin={{
              top: 10, right: 10, left: -20, bottom: 0, // Adjusted left margin for Y-axis labels
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" /> {/* Lighter grid lines */}
            <XAxis
              dataKey="name"
              stroke="#666" // Darker stroke for axis line
              tick={{ fill: 'black', fontSize: 12, fontFamily: 'Roboto', fontWeight: 400 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              stroke="#666" // Darker stroke for axis line
              tickFormatter={formatYAxisTick}
              tick={{ fill: 'black', fontSize: 12, fontFamily: 'Roboto', fontWeight: 400 }}
              axisLine={false}
              tickLine={false}
              domain={[0, 15000]} // Set domain to match image
            />
            <Tooltip
              cursor={{ stroke: '#ADB7F9', strokeWidth: 2 }} // Line for tooltip
              contentStyle={{ background: '#fff', border: '1px solid #ccc', borderRadius: '5px' }} // Light theme tooltip
              labelStyle={{ color: 'black' }}
              itemStyle={{ color: '#ADB7F9' }}
              formatter={(value) => [`${value.toLocaleString()}`, 'Consumption']} // Simplified formatter
            />
            <Area
              type="monotone"
              dataKey="consumption"
              stroke="#ADB7F9"
              fill="url(#alcoholGradient)"
              strokeWidth={2}
            />
            <defs>
              <linearGradient id="alcoholGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ADB7F9" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#ADB7F9" stopOpacity={0} />
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
