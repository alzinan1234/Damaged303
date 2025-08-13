"use client"; // This directive is required for client-side functionality in App Router components

import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image"; // Assuming Image component is used as in your previous code

export default function App() {
  // Changed to App for default export
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setLoading(true); // Indicate loading state

    // --- Client-side validation ---
    if (!email) {
      setError("Please enter your email address.");
      toast.error("Please enter your email address.");
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

    // --- Simulate API Call for sending OTP (Replace with your actual backend call) ---
    console.log("Attempting to send code to:", { email });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay

      // Simulate success or failure
      if (email === "test@example.com") {
        // Example for a successful send
        toast.success("OTP code sent to your email! (Simulated)");
        // Redirect to OTP verification page on successful simulated send
        window.location.href = "/Otp-Verification";
      } else {
        setError(
          "Failed to send OTP. Please check your email and try again. (Simulated)"
        );
        toast.error("Failed to send OTP. (Simulated)");
      }
    } catch (err) {
      console.error("Send code error:", err);
      setError("An unexpected error occurred. Please try again.");
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <div className="flex min-h-screen bg-[#1A1A1A]">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Left Panel - Image background with blur */}
      <div
        className="hidden lg:flex w-1/2 items-center justify-center p-8 bg-cover bg-center"
        style={{
          backgroundImage: `url(${
            "/arkive-image.png" // Using the provided image URL
          })`,
          // filter: "blur(4px)", // Apply blur effect (commented out as per your last input)
          // WebkitFilter: "blur(4px)", // For Safari (commented out as per your last input)
        }}
      >
        {/* No content needed inside this div as it's just a background */}
      </div>

      {/* Right Forgot Password Panel */}
      <div className="w-full lg:w-1/2 bg-[#2D2D2D] flex items-center justify-center p-4 sm:p-8">
        <div className="md:w-[564px] p-10 rounded-[15px] flex flex-col justify-center items-center gap-10">
          <div className="self-stretch flex flex-col justify-start items-center gap-[30px]">
            <div className="self-stretch flex flex-col justify-center items-center gap-[30px]">
              <div className="w-full flex flex-col justify-start gap-[18px]">
                <Image
                  src="/ark-logo.png"
                  alt="Arkive"
                  width={170}
                  height={150}
                  className="rounded-lg h-10"
                />
                <p className="self-stretch text-start text-white text-[24px] font-semibold ">
                  Forget Password
                </p>
                <p className="self-stretch text-start text-[#FFF] text-sm font-semibold ">
                  We will send the OTP code to your email for security in
                  forgetting your password
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
                      className="self-stretch text-white text-sm font-normal "
                    >
                      Email adress
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="self-stretch h-10 w-full px-3 py-2.5  rounded-md border border-[#DCDCDC] text-white focus:outline-none focus:ring-1 focus:ring-[#66B8FF] "
                      placeholder=""
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-red-500 text-sm text-center mt-2 ">
                    {error}
                  </p>
                )}

                {/* Send Code Button */}
                <button
                  type="submit"
                  className={`w-full h-10 mx-auto mt-4 bg-[#FFF] text-[#23272E] rounded-md text-sm font-normal font-[Inter] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex justify-center items-center transition duration-300 ease-in-out  ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
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
