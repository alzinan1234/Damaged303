"use client"; // This directive is required for client-side functionality in App Router components

import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function OtpVerificationPage() {
  // Changed to App for default export
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60); // 60 seconds for resend
  const [canResend, setCanResend] = useState(false);
  const otpInputRefs = useRef([]);

  useEffect(() => {
    let timer;
    if (resendTimer > 0 && !canResend) {
      timer = setTimeout(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [resendTimer, canResend]);

  const handleOtpChange = (e, index) => {
    const { value } = e.target;
    if (/[^0-9]/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to next input if a digit is entered
    if (value && index < otp.length - 1) {
      otpInputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move focus to previous input on backspace if current is empty
      otpInputRefs.current[index - 1].focus();
    }
  };

  const handleResendCode = () => {
    if (canResend) {
      setResendTimer(60);
      setCanResend(false);
      toast.success("OTP code re-sent! (Simulated)");
      // Add actual API call to resend OTP here
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setLoading(true); // Indicate loading state

    const enteredOtp = otp.join("");

    // --- Client-side validation ---
    if (enteredOtp.length !== 6 || !/^\d{6}$/.test(enteredOtp)) {
      setError("Please enter a valid 6-digit OTP.");
      toast.error("Please enter a valid 6-digit OTP.");
      setLoading(false);
      return;
    }

    // --- Simulate API Call for OTP verification (Replace with your actual backend call) ---
    console.log("Attempting to verify OTP:", { enteredOtp });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay

      // Simulate success or failure
      if (enteredOtp === "123456") {
        // Example for a successful OTP
        toast.success(
          "OTP Verified! Redirecting to password reset. (Simulated)"
        );
        // In a real app, redirect to a password reset page
        window.location.href = "/set-new-password";
      } else {
        setError("Invalid OTP. Please try again. (Simulated)");
        toast.error("Invalid OTP. (Simulated)");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      setError("An unexpected error occurred. Please try again.");
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <div className="flex min-h-screen bg-[#1A1A1A] ">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Left Panel - Image background with blur */}
      <div
        className="hidden lg:flex w-1/2 items-center justify-center p-8 bg-cover bg-center"
        style={{
          backgroundImage: `url(${
            "/arkive-image.png" // Using the provided image URL
          })`,
          // filter: "blur(4px)", // Apply blur effect
          // WebkitFilter: "blur(4px)", // For Safari
        }}
      >
        {/* No content needed inside this div as it's just a background */}
      </div>

      {/* Right OTP Verification Panel */}
      <div className="w-full lg:w-1/2 bg-[#2D2D2D] flex items-center justify-center p-4 sm:p-8">
        <div className="md:w-[564px] p-10 rounded-[15px] flex flex-col justify-center items-center gap-10">
          <div className="self-stretch flex flex-col justify-start items-center gap-[30px]">
            <div className="self-stretch flex flex-col justify-center items-center gap-[30px]">
              <div className="w-full flex flex-col justify-start gap-[18px]">
                {/* ARKIVE Logo/Text */}
                <Image
                  src="/ark-logo.png"
                  alt="Arkive"
                  width={170}
                  height={150}
                  className="rounded-lg h-10"
                />
                <p className="self-stretch text-start text-white text-[24px] font-semibold ">
                  OTP Verification
                </p>
                <p className="self-stretch text-start text-[#FFF] text-sm font-semibold">
                  Enter 6-digit Code for getting your password
                </p>
                <p className="self-stretch text-start text-[#FFF] text-sm font-semibold ">
                  We have sent code to{" "}
                  <span className="text-white">tan@gmail.com</span> to verify
                  your registration
                </p>
              </div>
              <form
                onSubmit={handleSubmit}
                className="w-full flex flex-col items-center gap-[18px]"
              >
                {/* OTP Input Fields */}
                <div className="flex justify-center gap-3 mt-4 w-full">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      ref={(el) => (otpInputRefs.current[index] = el)}
                      className="w-full h-12 text-center text-white bg-[#121212] rounded-md border border-[#DCDCDC] focus:outline-none focus:ring-1 focus:ring-[#66B8FF] font-[Inter] text-xl"
                      required
                    />
                  ))}
                </div>

                {/* Resend Code */}
                <div className="self-stretch text-center mt-4">
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResendCode}
                      className="text-[#CCE6FF] text-xs font-normal font-[Inter] hover:underline"
                    >
                      Resend Code
                    </button>
                  ) : (
                    <span className="text-[#B0B0B0] text-xs font-normal font-[Inter]">
                      Resend code{" "}
                      {resendTimer < 10 ? `0${resendTimer}` : resendTimer}s
                    </span>
                  )}
                </div>

                {error && (
                  <p className="text-red-500 text-sm text-center mt-2 font-[Inter]">
                    {error}
                  </p>
                )}

                {/* Verify Button */}
                <button
                  type="submit"
                  className={`w-full h-10 mx-auto mt-4 bg-[#FFF] text-[#23272E] rounded-md text-sm font-normal font-[Inter] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex justify-center items-center transition duration-300 ease-in-out  ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
