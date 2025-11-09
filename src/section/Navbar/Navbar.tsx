
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaRegCircleUser } from "react-icons/fa6";
import { MdDashboard } from "react-icons/md";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const goToProfile = () => {
    router.push("/profile");
    setOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-20 bg-[#f8fafc] flex justify-between items-center px-6 z-50 border-b border-[#019ee2]">
      <div className="flex items-center space-x-2">
        <MdDashboard size={36} color="#019ee2" />
        <h1 className="text-lg font-semibold text-gray-700">Dashboard</h1>
      </div>

      <div className="relative">
        <FaRegCircleUser
          size={28}
          className="cursor-pointer text-gray-700"
          onClick={() => setOpen(!open)}
        />

        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-white text-gray-700 shadow-lg rounded-lg overflow-hidden">
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={goToProfile}
            >
              Profile
            </button>
            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
              Settings
            </button>
            <button className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-500">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
