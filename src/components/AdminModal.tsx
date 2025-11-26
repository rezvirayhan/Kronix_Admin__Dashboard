"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { IUser } from "@/types/IUser";
interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: IUser | null;
  onSaved: () => void;
}
const API_URL = "http://localhost:5000/api/v1/users";
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
        await axios.put(`${API_URL}/${user._id}`, { name, email, password });
      } else {
        await axios.post(`${API_URL}/signup`, { name, email, password });
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
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          {user ? "Edit User" : "Add New User"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border p-2 w-full rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border p-2 w-full rounded"
          />
          <input
            type="password"
            placeholder={user ? "New Password (optional)" : "Password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full rounded"
          />
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => {
                onClose();
                setName("");
                setEmail("");
                setPassword("");
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {user ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminModal;
