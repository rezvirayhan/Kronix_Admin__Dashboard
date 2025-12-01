/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import Layout from "@/app/components/Layout";
import { FaUserAlt } from "react-icons/fa";
import axios from "axios";
import { IoCloseOutline } from "react-icons/io5";
import InputField from "@/app/components/InputFilde";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface IUser {
  name: string;
  email: string;
}

const ProfilePage = () => {
  const [user, setUser] = useState<IUser>({ name: "", email: "" });
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState<IUser>({ name: "", email: "" });
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);

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
        setLoading(true);
        const res = await axios.get(
          `http://localhost:5000/api/users/${userId}`
        );
        setUser(res.data);
        setFormData({ name: res.data.name, email: res.data.email });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/${userId}`,
        formData
      );
      setUser(res.data.user);
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <Layout>
      <div className="pt-5 lg:pl-28">
        <div className="lg:flex gap-3 items-center">
          {loading ? (
            <Skeleton circle height={70} width={70} />
          ) : (
            <FaUserAlt className="text-5xl bg-[#019ee2] text-white p-2 rounded-md" />
          )}
          <h2 className="text-2xl font-bold">
            {loading ? <Skeleton width={150} /> : user.name}
          </h2>
        </div>

        <div className="bg-white shadow-md w-11/12 mt-6 rounded-xl h-[530px]">
          <div className="pt-16 flex justify-center">
            {loading ? (
              <Skeleton circle height={100} width={100} />
            ) : (
              <img
                src="https://adgm-portal-qa.xr-23.com/_next/image?url=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F036%2F594%2F092%2Fnon_2x%2Fman-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg&w=256&q=75"
                alt="Avatar"
                className="rounded-full w-[13%]"
              />
            )}
          </div>

          <div className="lg:w-2/3 bg-[#d1d5dbad] mx-auto lg:h-30 mt-4 rounded-xl p-6">
            <div className="lg:flex pl-6 pt-2 pb-4 gap-10">
              <div>
                <h2 className="text-[#6b7280]">Name</h2>
                {loading ? <Skeleton width={120} /> : <h2>{user.name}</h2>}
              </div>
              <div className="mt-4 lg:mt-0">
                <h2 className="text-[#6b7280]">Email</h2>
                {loading ? <Skeleton width={200} /> : <h2>{user.email}</h2>}
              </div>
            </div>

            <div className="flex justify-center mt-14">
              {loading ? (
                <Skeleton width={120} height={35} />
              ) : (
                <button
                  onClick={() => setShowEditModal(true)}
                  className="px-4 py-2 bg-[#31acca] text-white rounded cursor-pointer"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {showEditModal && (
          <div className="fixed inset-0 bg-[#333333ec] flex items-center justify-center z-50">
            <div className="bg-[#e8ebf0] p-5 rounded-lg w-[420px]">
              <div className="flex justify-between">
                <h2 className="text-lg font-semibold mb-5">Update Profile</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="cursor-pointer"
                >
                  <IoCloseOutline className="text-xl" />
                </button>
              </div>
              <div className="mb-4">
                <label className="block mb-1.5 text-[#020817] text-sm font-semibold">
                  Name <span className="text-red-600">*</span>
                </label>
                <InputField
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1.5 text-[#020817] text-sm font-semibold">
                  Email <span className="text-red-600">*</span>
                </label>
                <InputField
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 mt-3 bg-[#02a6dd] text-white rounded w-full font-semibold cursor-pointer text-[14px]"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProfilePage;
