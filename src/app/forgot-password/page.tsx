/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { IMAGES } from "@/utils/images";
import InputField from "@/app/components/InputFilde";
import Link from "next/link";
import { useRouter } from "next/navigation";
const ForgotPassword = () => {
  const [step, setStep] = useState<"forgot" | "reset">("forgot");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const api = "https://kronix-back-end.vercel.app/api/users";
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await fetch(`${api}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error sending OTP");
      setMessage(data.message);
      setStep("reset");
    } catch (err: any) {
      setError(err.message);
    }
  };
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await fetch(`${api}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error resetting password");
      setMessage(data.message);
      setStep("forgot");
      setOtp("");
      setNewPassword("");
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-[#ebeff4]">
      {step === "forgot" ? (
        <>
          <div className="flex w-full md:w-[1050px] h-[400px] shadow-2xl rounded-2xl overflow-hidden bg-white">
            <div className="w-1/2 bg-gray-500 flex justify-center items-center">
              <Image
                src={IMAGES.logo}
                alt="Logo"
                className="w-[200px] md:w-[300px] object-contain"
                priority
              />
            </div>

            <div className="w-1/2 flex justify-center items-center bg-[#f4f4f4]">
              <div className="w-[80%]">
                <h1 className="text-2xl font-bold mb-1 text-blue-600">
                  Forgot Password
                </h1>
                <p className="mb-5 text-gray-700">
                  Enter your email to reset your password
                </p>
                {message && <p className="text-green-600 mb-2">{message}</p>}
                {error && <p className="text-red-600 mb-2">{error}</p>}
                <form onSubmit={handleForgotPassword}>
                  <InputField
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />

                  <button
                    type="submit"
                    className="mt-6 w-full bg-blue-600 text-white font-semibold py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition"
                  >
                    Send OTP
                  </button>
                </form>

                <div className="text-right mt-4">
                  <Link
                    href="/"
                    className="text-sm text-blue-600 hover:underline font-medium"
                  >
                    Return to Login?
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex w-full md:w-[1050px] h-[400px] shadow-2xl rounded-2xl overflow-hidden bg-white">
            <div className="w-1/2 bg-gray-500 flex justify-center items-center">
              <Image
                src={IMAGES.logo}
                alt="Logo"
                className="w-[200px] md:w-[300px] object-contain"
                priority
              />
            </div>

            <div className="w-1/2 flex justify-center items-center bg-[#f4f4f4]">
              <div className="w-[80%]">
                <h1 className="text-2xl font-bold mb-1 text-blue-600">
                  Forgot Password
                </h1>
                <p className="mb-5 text-gray-700">Reset your password</p>
                {message && <p className="text-green-600 mb-2">{message}</p>}
                {error && <p className="text-red-600 mb-2">{error}</p>}
                <form onSubmit={handleResetPassword}>
                  <InputField
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <InputField
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />

                  <button
                    type="submit"
                    className="mt-6 w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Reset Password
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
