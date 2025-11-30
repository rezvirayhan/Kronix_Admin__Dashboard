"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaRegCircleUser } from "react-icons/fa6";
import { MdDashboard } from "react-icons/md";
import Logout from "../SignIn/Logout";
import { FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface IUser {
  name: string;
  email: string;
}

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [userId, setUserId] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const decoded: any = jwtDecode(token);
      setUserId(decoded.id);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/users/${userId}`
        );
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, [userId]);

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
          <div className="absolute right-0 mt-2 w-64 bg-white text-gray-700 shadow-lg rounded-lg overflow-hidden">
            <div className="block w-full text-left px-4 py-2 bg-[#E5F4FB]">
              <div className="flex items-center ">
                <FaRegCircleUser
                  size={28}
                  className="cursor-pointer text-[#019ee2]"
                />
                <div className="ml-4">
                  <h2>{user?.name || "Loading..."}</h2>
                  <h2 className="text-[#019ee2] font-semibold text-[12px]">
                    Administrator
                  </h2>
                </div>
              </div>
            </div>
            <button
              className="flex items-center gap-2 w-full cursor-pointer text-left px-4 py-2 hover:bg-gray-100"
              onClick={goToProfile}
            >
              <FaUser className="text-sm text-gray-600" />
              <span className="text-[14px] font-normal">Profile</span>
            </button>

            <button className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100">
              <FaCog className="text-sm text-gray-600" />
              <span className="text-[14px] font-normal">Settings</span>
            </button>

            <Logout
              className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-red-100 text-red-500 cursor-pointer"
              redirectTo="/"
            >
              <FaSignOutAlt className="text-sm text-red-500" />
              <span className="text-[14px] font-normal">Logout</span>
            </Logout>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
