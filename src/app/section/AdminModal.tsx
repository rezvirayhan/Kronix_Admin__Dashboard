"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { IUser } from "@/app/types/IUser";
import { IoCloseOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import InputField from "../components/InputFilde";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: IUser | null;
  onSaved: () => void;
}

const API_URL = "https://kronix-back-end.vercel.app/api/users";
const AdminModal: React.FC<Props> = ({ isOpen, onClose, user, onSaved }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPassword("");
    } else {
      setName("");
      setEmail("");
      setPassword("");
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (user && user._id) {
        await axios.put(`${API_URL}/${user._id}`, { name, email });
        toast.success("Admin Update successfully!");
      } else {
        await axios.post(`${API_URL}/signup`, { name, email, password });
        toast.success("User Added successfully!");
      }

      onSaved();
      onClose();
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error(err);
      alert("Failed to save user");
    }
  };

  return (
    <div className="fixed inset-0 bg-[#333333ec] flex justify-center items-center z-50">
      <div className="bg-[#e8ebf0] rounded-lg shadow-lg w-[420px] p-5">
        <div className="flex justify-between">
          <h2 className="text-lg font-medium mb-6">
            {user ? "Edit Admin" : "Add Admin"}
          </h2>
          <button
            type="button"
            onClick={() => {
              onClose();
              setName("");
              setEmail("");
              setPassword("");
            }}
          >
            <IoCloseOutline className="text-xl cursor-pointer" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block mb-1.5 text-[#020817] text-sm font-semibold">
            Name <span className="text-red-600">*</span>
          </label>
          <InputField
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border p-2 rounded w-full"
          />

          <label className="block mb-1.5 text-[#020817] text-sm font-semibold">
            Email <span className="text-red-600">*</span>
          </label>
          <InputField
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border p-2 rounded w-full"
          />

          {!user && (
            <InputField
              label="Password"
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border p-2 rounded w-full"
            />
          )}
          <button
            type="submit"
            className="px-4 py-2 mt-3 bg-[#02a6dd] text-white rounded w-full font-semibold cursor-pointer text-[14px]"
          >
            {user ? "Update" : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminModal;
