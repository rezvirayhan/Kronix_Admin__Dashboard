"use client";

import React, { useState } from "react";
import Image from "next/image";
import { IMAGES } from "@/utils/images";
import InputField from "@/components/InputFilde";
import Link from "next/link";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Password reset link sent to:", email);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-[#ebeff4]">
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

            <form onSubmit={handleResetPassword}>
              <InputField
                label="Email Address"
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mb-3"
              />

              <button
                type="submit"
                className="mt-6 w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Send Reset Link
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
    </div>
  );
};

export default ForgotPassword;
