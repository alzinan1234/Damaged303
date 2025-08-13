"use client"; // This directive is required for client-side functionality in App Router components

import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setLoading(true); // Indicate loading state

    // --- Client-side validation ---
    if (!email || !password) {
      setError("Please enter both email and password.");
      toast.error("Please enter both email and password.");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      toast.error("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    // --- Simulate API Call (Replace with your actual backend call) ---
    console.log("Attempting to log in with:", { email, password, rememberMe });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay

      let success = false;
      let redirectPath = "/";
      let token = ""; // To store the token for setting in cookie

      // --- Simulated Admin Login ---
      if (email === "admin@example.com" && password === "admin123") {
        console.log("Admin Login successful!");
        toast.success("Admin Login Successful! (Simulated)");
        token = "ADMIN_TOKEN_SECRET"; // Set admin token
        redirectPath = "/admin"; // Redirect admin to /admin
        success = true;
      }
      // --- Simulated Regular User Login ---
      else if (email === "user@example.com" && password === "password123") {
        console.log("User Login successful!");
        toast.success("User Login Successful! (Simulated)");
        token = "USER_TOKEN_SECRET"; // Set regular user token
        redirectPath = "/admin";
        success = true;
      }
      // --- Simulated Failed Login ---
      else {
        setError("Invalid email or password. (Simulated)");
        toast.error("Invalid email or password. (Simulated)");
      }

      if (success) {
        document.cookie = `token=${token}; path=/; max-age=${
          rememberMe ? 60 * 60 * 24 * 30 : 60 * 30
        }; SameSite=Lax`;
        // Use standard window navigation instead of Next.js router
        window.location.href = redirectPath;
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false); // End loading state
    }
  };

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    // Updated background to white
    <div className="flex min-h-screen bg-white">
      <Toaster position="top-center" reverseOrder={false} />
      {/* Left Red Panel - now with image background and blur */}
      {/* This panel's background remains an image and its styling is unchanged */}
      <div
        className="hidden lg:flex w-1/2   items-center justify-center p-8 bg-cover bg-center bg-no-repeat"
        style={{
          // Replaced Next.js image path with a placeholder URL
          backgroundImage: `url("/hr-women.jpg")`,
        }}
      >
      </div>
      {/* Right Login Panel */}
      {/* Updated background to white */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-4 sm:p-8">
        <div className="md:w-[564px] p-10 rounded-[15px] flex flex-col justify-center items-center gap-10">
          <div className="self-stretch flex flex-col justify-start items-center gap-[30px]">
            <div className="self-stretch flex flex-col justify-center items-center gap-[30px]">
              <div className="w-full  flex flex-col justify-start gap-[18px]">
                {/* Replaced Next.js Image component with a standard <img> tag */}
                <img
                  src="/side-bar-logo.png"
                  alt="Arkive"
                  width={200}
                  height={40}
                  className="w-[200] "
                />
                {/* Updated text color to black */}
                <p className="self-stretch text-start text-black text-[24px] font-semibold">
                  Welcome to HRLynx
                </p>
                {/* Updated text color to black */}
                <p className="self-stretch text-start text-black text-sm font-semibold ">
                  Sign in to your account
                </p>
              </div>
              <form
                onSubmit={handleSubmit}
                className="w-full flex flex-col items-end gap-[18px]"
              >
                <div className="self-stretch flex flex-col justify-start items-start gap-[18px]">
                  {/* Email Input */}
                  <div className="self-stretch flex flex-col justify-start items-start gap-2">
                    {/* Updated text color to black */}
                    <label
                      htmlFor="email"
                      className="self-stretch text-black text-sm font-normal font-[Inter]"
                    >
                      Email address
                    </label>
                    {/* Updated text color to black */}
                    <input
                      type="email"
                      id="email"
                      className="self-stretch h-10 w-full px-3 py-2.5  rounded-md border border-[#DCDCDC] text-black focus:outline-none focus:ring-1 focus:ring-[#66B8FF] font-[Inter]"
                      placeholder=""
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  {/* Password Input */}
                  <div className="self-stretch flex flex-col justify-start items-start gap-2">
                    {/* Updated text color to black */}
                    <label
                      htmlFor="password"
                      className="self-stretch text-black text-sm font-normal font-[Inter]"
                    >
                      Password
                    </label>
                    <div className="relative self-stretch">
                      {/* Updated text color to black */}
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        className="h-10 px-3 py-2.5  rounded-md border border-[#DCDCDC] text-black focus:outline-none focus:ring-1 focus:ring-[#66B8FF] font-[Inter] w-full pr-10"
                        placeholder=""
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      {/* Updated eye icon color for better visibility on white background */}
                    </div>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="self-stretch flex justify-between items-center mt-2">
                  <label
                    htmlFor="rememberMe"
                    className="flex items-center gap-3 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      id="rememberMe"
                      className="hidden peer"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    {/* Updated checkbox colors for light theme */}
                    <div className="w-[18px] h-[18px] bg-gray-200 peer-checked:bg-[#013D3B] rounded-[2px] border border-gray-400 peer-checked:border-[#013D3B] flex items-center justify-center relative">
                      {rememberMe && (
                        <svg
                          className="w-3 h-3 text-white absolute"
                          fill="none"
                          viewBox="0 0 14 11"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M1 5.5L4.95263 9.5L13 1.5" />
                        </svg>
                      )}
                    </div>
                    {/* Updated text color to black */}
                    <span className="text-black text-xs font-normal font-[Inter]">
                      Remember Password
                    </span>
                  </label>
                  {/* Updated link color to match button color */}
                  <a
                    href="/Forgot-Password"
                    className="text-[#013D3B] text-xs font-normal font-[Inter] hover:underline"
                  >
                    Forgot Password?
                  </a>
                </div>

                {error && (
                  <p className="text-red-500 text-sm text-center mt-2 font-[Inter]">
                    {error}
                  </p>
                )}

                {/* Sign In Button */}
                {/* Updated background to #013D3B and text to white */}
                <button
                  type="submit"
                  className={`w-full h-10 mx-auto mt-4 bg-[#013D3B] text-white rounded-md text-sm font-normal font-[Inter] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex justify-center items-center transition duration-300 ease-in-out  ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
