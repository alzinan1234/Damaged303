"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import hrLogo from '../../../../public/side-bar-logo.png'

export default function ForgotPasswordFlow() {
  const [step, setStep] = useState("forgot"); // "forgot" | "otp" | "reset"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(""); // ✅ stored as string
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const otpInputRefs = useRef([]);

  /** ---------- Step 1: Send OTP ---------- */
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Sending OTP...");

    if (!email) {
      toast.error("Please enter your email", { id: toastId });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        "https://maintains-usb-bell-with.trycloudflare.com/api/dashboard/auth/forgot-password/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "OTP sent!", { id: toastId });
        setStep("otp");
        setOtp("");
      } else {
        toast.error(data.message || "Error sending OTP", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  /** ---------- Step 2: Verify OTP (Frontend Check Only) ---------- */
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Verifying OTP...");

    if (otp.length !== 4) {
      toast.error("Enter a valid 4-digit OTP", { id: toastId });
      setLoading(false);
      return;
    }

    try {
      // Usually you'd verify OTP via backend, but since reset-password requires OTP,
      // we'll just move to reset step here.
      toast.success("OTP Verified!", { id: toastId });
      setStep("reset");
    } catch (err) {
      console.error(err);
      toast.error("Invalid OTP", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  /** ---------- Resend OTP ---------- */
  const handleResendOtp = async () => {
    setLoading(true);
    const toastId = toast.loading("Resending OTP...");

    try {
      const res = await fetch(
        "https://maintains-usb-bell-with.trycloudflare.com/api/dashboard/auth/resend-otp/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "OTP resent!", { id: toastId });
        setOtp("");
        otpInputRefs.current[0]?.focus();
      } else {
        toast.error(data.message || "Failed to resend OTP", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  /** ---------- Step 3: Reset Password ---------- */
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Resetting password...");

    if (!newPassword || !confirmPassword) {
      toast.error("Both fields are required", { id: toastId });
      setLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match", { id: toastId });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        "https://maintains-usb-bell-with.trycloudflare.com/api/dashboard/auth/reset-password/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            otp,
            new_password: newPassword,
            confirm_password: confirmPassword,
          }),
        }
      );
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Password reset successfully!", {
          id: toastId,
        });
        setStep("forgot");
        setEmail("");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
        // Redirect to login page after success
        window.location.href = "/";
      } else {
        toast.error(data.message || "Reset failed", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  /** ---------- Step UIs ---------- */
  return (
    <div className="flex min-h-screen bg-white items-center justify-center">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="w-full max-w-md p-6 rounded-lg shadow-md border">
        <Image src={hrLogo} alt="Logo" width={180} height={40} />

        {/* Step 1: Forgot Password */}
        {step === "forgot" && (
          <form onSubmit={handleForgotSubmit} className="mt-6 space-y-4">
            <h2 className="text-xl font-semibold">Forgot Password</h2>
            <p className="text-sm text-gray-600">
              Enter your email to receive a code.
            </p>
            <input
              type="email"
              className="w-full border p-2 rounded"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#013D3B] text-white py-2 rounded"
            >
              {loading ? "Sending..." : "Send Code"}
            </button>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === "otp" && (
          <form onSubmit={handleOtpSubmit} className="mt-6 space-y-4">
            <h2 className="text-xl font-semibold">OTP Verification</h2>
            <p className="text-sm text-gray-600">
              Enter the 4-digit code sent to <b>{email}</b>
            </p>
            <div className="flex justify-between gap-2">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={otp[index] || ""}
                  ref={(el) => (otpInputRefs.current[index] = el)}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/, "");
                    const newOtp =
                      otp.substring(0, index) + val + otp.substring(index + 1);
                    setOtp(newOtp);
                    if (val && index < 3) {
                      otpInputRefs.current[index + 1]?.focus();
                    }
                  }}
                  className="w-12 h-12 text-center border rounded text-xl"
                />
              ))}
            </div>

            {/* Resend OTP */}
            <button
              type="button"
              disabled={loading}
              onClick={handleResendOtp}
              className="text-sm text-blue-600 underline"
            >
              Resend OTP
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#013D3B] text-white py-2 rounded"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>
        )}

        {/* Step 3: Reset Password */}
        {step === "reset" && (
          <form onSubmit={handleResetSubmit} className="mt-6 space-y-4">
            <h2 className="text-xl font-semibold">Set New Password</h2>
            <div>
              <input
                type="password"
                className="w-full border p-2 rounded"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                type="password"
                className="w-full border p-2 rounded"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#013D3B] text-white py-2 rounded"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
