"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const EarningOverviewChart = () => {
  const [selectedYear, setSelectedYear] = useState(2025);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [currentEarningData, setCurrentEarningData] = useState([]);

  const years = [2023, 2024, 2025, 2026];

  const generateEarningData = useCallback((year) => {
    const baseData = [
      { month: "Jan", height: 58, value: 5800, active: false },
      { month: "Feb", height: 142, value: 14200, active: false },
      { month: "Mar", height: 98, value: 9800, active: false },
      { month: "Apr", height: 112, value: 11200, active: false },
      { month: "May", height: 90, value: 9000, active: false },
      { month: "Jun", height: 161, value: 16100, active: true },
      { month: "Jul", height: 78, value: 7800, active: false },
      { month: "Aug", height: 142, value: 14200, active: false },
      { month: "Sep", height: 39, value: 3900, active: false },
      { month: "Oct", height: 112, value: 11200, active: false },
      { month: "Nov", height: 63, value: 6300, active: false },
      { month: "Dec", height: 98, value: 9800, active: false },
    ];

    return baseData.map((item) => {
      let newHeight = item.height;
      let newValue = item.value;
      if (year === 2024) {
        newHeight = Math.max(20, item.height - 20);
        newValue = Math.max(2000, item.value - 2000);
      } else if (year === 2023) {
        newHeight = Math.max(20, item.height - 40);
        newValue = Math.max(2000, item.value - 4000);
      } else if (year === 2026) {
        newHeight = Math.min(180, item.height + 10);
        newValue = Math.min(18000, item.value + 1000);
      }
      return {
        ...item,
        height: newHeight,
        value: newValue,
        active: item.month === "Jun",
      };
    });
  }, []);

  useEffect(() => {
    setCurrentEarningData(generateEarningData(selectedYear));
  }, [selectedYear, generateEarningData]);

  const chartHeight = 161;
  const chartWidth = 737;

  const CustomBar = (props) => {
    const { x, y, width, height, payload } = props;
    const isActive = payload.active;

    return (
      <foreignObject x={x} y={y} width={width} height={height} style={{ overflow: 'visible' }}>
        <div
          style={{ width: width, height: height, background: isActive ? '#013D3B' : undefined }}
          className={`w-10 ${isActive ? 'h-40' : 'bg-gray-300'} rounded`}
        />
      </foreignObject>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-white rounded shadow-xl text-black text-xs font-montserrat">
          <p className="font-bold">{label}</p>
          <p className="text-gray-600">{`Earning: $${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleYearSelect = (year, event) => {
    event.stopPropagation();
    setSelectedYear(year);
    setIsDropdownOpen(false);
  };

  return (
    <div className="h-full w-full px-6 py-5 bg-white rounded shadow-xl flex flex-col justify-start items-start gap-2.5">
      {/* Header Section */}
      <div className="self-stretch flex flex-col justify-start items-start gap-14">
        <div className="self-stretch flex justify-between items-center">
          <div className="text-black text-xl font-semibold leading-tight">
            Earning Overview
          </div>
          {/* Year Dropdown */}
          <div className="relative">
            <div
              className="p-2 bg-gray-200 rounded flex justify-start items-center gap-2 cursor-pointer"
              onClick={toggleDropdown}
            >
              <div className="text-right text-black text-xs font-semibold font-montserrat leading-[10px]">
                {selectedYear}
              </div>
              {/* Dropdown Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-2.5 w-2.5 text-black transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {/* Dropdown Options */}
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-20 bg-white text-black rounded shadow-lg z-50">
                {years.map((year) => (
                  <div
                    key={year}
                    className="px-4 py-2 text-black text-xs font-semibold font-montserrat leading-[10px] hover:bg-gray-100 cursor-pointer"
                    onClick={(e) => handleYearSelect(year, e)}
                  >
                    {year}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chart Section */}
        <div className="self-stretch flex flex-col justify-start items-start gap-[5px]">
          <div className=" flex items-center gap-4 relative w-full">
            <div className="absolute top-0 left-0 w-full h-0 border-t border-dashed border-gray-400 z-10"></div>
            <div className="absolute right-0 bg-white text-black text-xs font-medium font-montserrat leading-tight z-10">
              $179
            </div>
          </div>

          <div
            className="w-full"
            style={{ height: `${chartHeight + 20}px` }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={currentEarningData}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              >
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                  tick={{
                    fill: "#6b7280",
                    fontSize: 12,
                    fontWeight: 500,
                    fontFamily: "Montserrat",
                  }}
                  height={30}
                />
                <YAxis
                  hide
                  domain={[0, 180]}
                />
                <Tooltip cursor={false} content={<CustomTooltip />} />
                <Bar
                  dataKey="height"
                  shape={<CustomBar />}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningOverviewChart;