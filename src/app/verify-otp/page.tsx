"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import { IMAGES } from "@/utils/images";
import Link from "next/link";

const VerifyOtpPage = () => {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [loading, setLoading] = useState(false);

  const email =
    typeof window !== "undefined" ? localStorage.getItem("emailForOtp") : null;

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    // Auto focus next input if value typed
    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalOtp = otp.join(""); // Convert into string

    if (finalOtp.length < 4) return toast.error("Enter a valid 4-digit OTP");
    if (!email) return toast.error("Email not found");

    setLoading(true);
    try {
      const res = await fetch(
        "https://kronix-back-end.vercel.app/api/users/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp: finalOtp }),
        }
      );

      const data = await res.json();
      if (!res.ok) toast.error(data.message || "Invalid OTP");
      else {
        localStorage.setItem("authToken", data.token);
        toast.success("Login successful");
        router.push("/dashboard");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen">
      <div className="flex w-full md:w-[1020px] h-[420px] shadow-2xl rounded-xl overflow-hidden">
        <div className="w-1/2 bg-gray-500 flex justify-center items-center">
          <Image
            src={IMAGES.logo}
            alt="Logo"
            className="w-[200px] md:w-[300px]"
            priority
          />
        </div>

        <div className="w-1/2 flex justify-center items-center bg-[#f4f4f4]">
          <div className="w-[80%]">
            <h1 className="text-2xl font-semibold mb-1 text-center text-black">
              Sign in
            </h1>
            <p className="mb-5 text-center text-[#64748B] text-sm">
              Enter the OTP sent to your email
            </p>

            <form
              onSubmit={handleVerify}
              className="flex flex-col items-center gap-5"
            >
              <div className="flex items-center">
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  {otp.slice(0, 2).map((value, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputsRef.current[index] = el;
                      }}
                      type="text"
                      maxLength={1}
                      value={value}
                      onChange={(e) => handleChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className="w-14 h-14 border-gray-300 text-center text-xl font-semibold outline-none border-r last:border-none"
                    />
                  ))}
                </div>

                <span className="mx-3 text-xl font-bold">-</span>

                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  {otp.slice(2, 4).map((value, index) => (
                    <input
                      key={index + 2}
                      ref={(el) => {
                        inputsRef.current[index + 2] = el;
                      }}
                      type="text"
                      maxLength={1}
                      value={value}
                      onChange={(e) => handleChange(e.target.value, index + 2)}
                      onKeyDown={(e) => handleKeyDown(e, index + 2)}
                      className="w-14 h-14 border-gray-300 text-center text-xl font-semibold outline-none border-r last:border-none"
                    />
                  ))}
                </div>
              </div>

              <div className="text-right w-full">
                <Link
                  href="/"
                  className="text-sm text-blue-600 hover:underline font-medium"
                >
                  Return login
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-[#02a6dd] w-full text-white py-3 cursor-pointer rounded text-sm hover:bg-[#0483ad] transition"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
