"use client"; // This directive is required for client-side functionality in App Router components

import LottiePlayer from "@/components/LottiePlayer";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Image from "next/image";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import leftSideImage from "../../../../public/login-image.png"
import hrLogo from '../../../../public/side-bar-logo.png' // Importing the left side image

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

    // --- Real API Call ---
    try {
      const response = await fetch(
        "https://parental-creek-latin-monroe.trycloudflare.com/api/dashboard/auth/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Admin login successful
        console.log("Admin login successful!", data);
        toast.success("Welcome Admin!");

        // Set admin token cookie
        const token = data.data.tokens.access;
        const tokenRefresh = data.data.tokens.refresh;

        if (tokenRefresh) {
          localStorage.setItem("adminTokenRefresh", tokenRefresh);
        }

        if (token) {
          // Set secure cookie for admin session
          const maxAge = rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 8; // 7 days or 8 hours for admin
          document.cookie = `adminToken=${token}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`;
        }

        // Store admin data
        if (data.admin || data.user) {
          const adminData = data.admin || data.user;
          sessionStorage.setItem("adminUser", JSON.stringify(adminData));

          // Verify admin role if provided
          if (
            adminData.role &&
            adminData.role !== "admin" &&
            adminData.role !== "administrator"
          ) {
            setError("Access denied. Admin privileges required.");
            toast.error("Access denied. Admin privileges required.");
            setLoading(false);
            return;
          }
        }

        // Always redirect to admin dashboard
        window.location.href = "/admin";
      } else {
        // Login failed
        console.error("Login failed:", data);

        // Handle different admin login error scenarios
        const errorMessage = data?.message || "Login failed";

        if (response.status === 401) {
          setError("Invalid admin credentials.");
          toast.error("Invalid admin credentials.");
        } else if (response.status === 403) {
          setError("Access denied. Admin privileges required.");
          toast.error("Access denied. Admin privileges required.");
        } else if (response.status === 400) {
          setError(errorMessage);
          toast.error(errorMessage);
        } else if (response.status >= 500) {
          setError("Server error. Please try again later.");
          toast.error("Server error. Please try again later.");
        } else {
          setError(errorMessage);
          toast.error(errorMessage);
        }
      }
    } catch (err) {
      console.error("Network error:", err);

      // Handle network errors
      if (err.name === "TypeError" && err.message.includes("fetch")) {
        setError("Network error. Please check your internet connection.");
        toast.error("Network error. Please check your internet connection.");
      } else {
        setError("An unexpected error occurred. Please try again.");
        toast.error("An unexpected error occurred. Please try again.");
      }
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
    <div className="flex min-h-screen ">
      <Toaster position="top-center" reverseOrder={false} />
      {/* Left Red Panel - now with image background and blur */}
      {/* This panel's background remains an image and its styling is unchanged */}
      <div className="hidden lg:flex w-1/2 login_bg  items-center justify-center ">
        {/* <div>
          <Image
            src={leftSideImage}
            alt="Login Background"
            width={1000}
            height={500}
            className="w-1/2 h-1/2"
          />
        </div> */}
      </div>
      {/* Right Login Panel */}
      {/* Updated background to white */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-4 sm:p-8">
        <div className="md:w-[564px] p-10 rounded-[15px] flex flex-col justify-center items-center gap-10">
          <div className="self-stretch flex flex-col justify-start items-center gap-[30px]">
            <div className="self-stretch flex flex-col justify-center items-center gap-[30px]">
              <div className="w-full  flex flex-col justify-start gap-[18px]">
                {/* Replaced Next.js Image component with a standard <img> tag */}
                <Image
                  src={hrLogo}
                  alt="Arkive"
                  width={200}
                  height={40}
                  className="w-[200]"
                />
                {/* Updated text color to black */}
                <p className="self-stretch text-start text-black text-[24px] font-semibold">
                  Admin Dashboard
                </p>
                {/* Updated text color to black */}
                <p className="self-stretch text-start text-black text-sm font-semibold ">
                  Sign in to admin panel
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
                      Admin Email
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
                      Admin Password
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
                      {/* Eye icon for password visibility toggle */}
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        )}
                      </button>
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
                      Keep me signed in
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
                  className={`w-full h-10 mx-auto mt-4 bg-[#013D3B] text-white rounded-md text-sm font-normal font-[Inter] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex justify-center items-center transition duration-300 ease-in-out hover:bg-[#012D2B] ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? "Signing In..." : "Sign In to Admin Panel"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
