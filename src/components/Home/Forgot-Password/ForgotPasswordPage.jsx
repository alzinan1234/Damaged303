"use client"; // This directive is required for client-side functionality in App Router components

import Image from "next/image";
import React, { useState } from "react";
// useRouter and Image from next/navigation and next/image are specific to the Next.js framework
// and may not be available in all React environments.
// We will use standard browser APIs instead.
import toast, { Toaster } from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setLoading(true); // Indicate loading state
    const toastId = toast.loading("Sending request...");

    // --- Client-side validation ---
    if (!email) {
      setError("Please enter your email address.");
      toast.error("Please enter your email address.", { id: toastId });
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      toast.error("Please enter a valid email address.", { id: toastId });
      setLoading(false);
      return;
    }

    // --- API Call to send OTP ---
    try {
      const response = await fetch(
        "https://parental-creek-latin-monroe.trycloudflare.com/api/dashboard/auth/forgot-password/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Handle success
        toast.success(data.message || "OTP code sent to your email!", {
          id: toastId,
        });
        // Redirect to OTP verification page on success using standard browser navigation
        window.location.href = `/Otp-Verification?email=${encodeURIComponent(
          email
        )}`;
      } else {
        // Handle server-side errors (e.g., email not found)
        const errorMessage =
          data.email?.[0] ||
          data.message ||
          "Failed to send OTP. Please check your email and try again.";
        setError(errorMessage);
        toast.error(errorMessage, { id: toastId });
      }
    } catch (err) {
      // Handle network or other unexpected errors
      console.error("Forgot password error:", err);
      const errorMessage = "An unexpected error occurred. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage, { id: toastId });
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Left Panel - Image background */}
      <div className="hidden lg:flex w-1/2 login_bg items-center justify-center">
        {/* This div is for the background image, styled via CSS */}
      </div>

      {/* Right Forgot Password Panel */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-4 sm:p-8">
        <div className="md:w-[564px] p-10 rounded-[15px] flex flex-col justify-center items-center gap-10">
          <div className="self-stretch flex flex-col justify-start items-center gap-[30px]">
            <div className="self-stretch flex flex-col justify-center items-center gap-[30px]">
              <div className="w-full flex flex-col justify-start gap-[18px]">
                {/* Replaced Next.js Image with standard HTML img tag */}
                <Image
                  src="/side-bar-logo.png"
                  alt="Arkive"
                  width={200}
                  height={40}
                  className="w-[200]"
                />
                <p className="self-stretch text-start text-black text-[24px] font-semibold">
                  Forgot Password
                </p>
                <p className="self-stretch text-start text-black text-sm font-semibold">
                  We will send an OTP code to your email to reset your password.
                </p>
              </div>
              <form
                onSubmit={handleSubmit}
                className="w-full flex flex-col items-end gap-[18px]"
              >
                <div className="self-stretch flex flex-col justify-start items-start gap-[18px]">
                  {/* Email Input */}
                  <div className="self-stretch flex flex-col justify-start items-start gap-2">
                    <label
                      htmlFor="email"
                      className="self-stretch text-black text-sm font-normal"
                    >
                      Email address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="self-stretch h-10 w-full px-3 py-2.5 rounded-md border border-[#DCDCDC] text-black focus:outline-none focus:ring-1 focus:ring-[#66B8FF]"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      aria-label="Email address for password reset"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-red-500 text-sm text-center mt-2 w-full">
                    {error}
                  </p>
                )}

                {/* Send Code Button */}
                <button
                  type="submit"
                  className={`w-full h-10 mx-auto mt-4 bg-[#013D3B] text-white rounded-md text-sm font-normal font-[Inter] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex justify-center items-center transition duration-300 ease-in-out hover:bg-[#025a57] disabled:opacity-70 disabled:cursor-not-allowed`}
                  disabled={loading}
                >
                  {loading ? "Sending Code..." : "Send Code"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
