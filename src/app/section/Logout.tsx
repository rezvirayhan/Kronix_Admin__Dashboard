"use client";

import React from "react";
import { toast } from "react-toastify";

interface LogoutProps {
  className?: string;
  redirectTo?: string;
  children?: React.ReactNode;
}

const Logout: React.FC<LogoutProps> = ({
  className = "block w-full text-left px-4 py-2 hover:bg-red-100 text-red-500",
  redirectTo = "/",
  children = "Logout",
}) => {
  const handleLogout = () => {
    localStorage.removeItem("authToken");

    toast.success("You have been logged out", {
      position: "bottom-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    setTimeout(() => {
      window.location.href = redirectTo;
    }, 4000);
  };

  return (
    <div>
      <button onClick={handleLogout} className={className}>
        {children}
      </button>
    </div>
  );
};

export default Logout;
