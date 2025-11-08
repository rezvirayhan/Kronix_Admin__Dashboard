"use client";

import React, { useState } from "react";
import Image from "next/image";
import { IMAGES } from "@/utils/images";
import InputField from "@/components/InputFilde";
import Link from "next/link";

const Login = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };
  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-[#ebeff4]">
      <div className="flex w-full md:w-[900px] h-[600px] shadow-2xl rounded-2xl overflow-hidden bg-white">
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
            <h1 className="text-2xl font-bold mb-1 text-blue-600">Login</h1>
            <p className="mb-5 text-gray-700">Sign in to your account</p>

            <InputField
              label="Email"
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mb-3"
            />

            <InputField
              label="Password"
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1"
            />

            <div className="text-right mt-2">
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                Forgot Password?
              </Link>
            </div>

            <button className="mt-6 w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition">
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
