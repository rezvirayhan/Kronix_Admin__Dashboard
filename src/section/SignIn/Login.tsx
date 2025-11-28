"use client";
import React, { useState } from "react";
import Image from "next/image";
import { IMAGES } from "@/utils/images";
import InputField from "@/components/InputFilde";
import Link from "next/link";
import { toast } from "react-toastify";

const Login = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        toast.error(data.message || "Login failed", {
          position: "bottom-right",
        });
      } else {
        if (data.token) localStorage.setItem("authToken", data.token);
        toast.success("Login successful", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        onLogin();
      }
    } catch (err) {
      setError("Something went wrong");
      console.log(err);
      toast.error("Something went wrong", {
        position: "bottom-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center justify-center min-h-screen">
        <div className="flex w-full md:w-[1020px] h-[420px] shadow-2xl rounded-xl overflow-hidden">
          <div className="w-1/2 bg-gray-500 flex justify-center items-center">
            <Image
              src={IMAGES.logo}
              alt="Logo"
              className="w-[2000px] md:w-[300px] object-contain"
              priority
            />
          </div>

          <div className="w-1/2 flex justify-center items-center bg-[#f4f4f4]">
            <div className="w-[80%]">
              <h1 className="text-2xl font-semibold mb-1 text-black">
                Sign in
              </h1>
              <p className="mb-5 text-[#64748B] text-sm">
                Sign in to your account
              </p>
              <form onSubmit={handleSubmit}>
                <InputField
                  label="Email"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="mail@example.com"
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
                  placeholder="***********"
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

                {error && <p className="text-red-500 mt-2">{error}</p>}

                <button
                  type="submit"
                  className="mt-6 w-full bg-[#02a6dd] text-white rounded py-3 cursor-pointer font-light text-sm hover:bg-[#0483ad] transition"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
