"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { IBlog } from "@/app/dashboard/blogs/page";
import InputField from "./InputFilde";
import { IoCloseOutline } from "react-icons/io5";
import { toast } from "react-toastify";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  blog: IBlog | null;
  onSaved: () => void;
}
const API_URL = "http://localhost:5000/api/blogs";
export const BlogModal: React.FC<Props> = ({
  isOpen,
  onClose,
  blog,
  onSaved,
}) => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (blog) {
      setTitle(blog.title || "");
      setSubtitle(blog.subtitle || "");
      setDescription(blog.description || "");
      setImageFile(null);
    } else {
      setTitle("");
      setSubtitle("");
      setDescription("");
      setImageFile(null);
    }
  }, [blog, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return alert("Title is required");

    const data = new FormData();
    data.append("title", title);
    if (subtitle) data.append("subtitle", subtitle);
    if (description) data.append("description", description);
    if (imageFile) data.append("image", imageFile);

    try {
      if (blog && blog._id) {
        await axios.put(`${API_URL}/${blog._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(API_URL, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      onSaved();
      onClose();
      setTitle("");
      setSubtitle("");
      setDescription("");
      setImageFile(null);
    } catch (err) {
      console.error(err);
      alert("Failed to save blog");
    }
  };

  return (
    <div className="fixed inset-0 bg-[#333333ec] flex justify-center items-center z-50">
      <div className="bg-[#e8ebf0] rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between">
          <h2 className="text-lg font-medium mb-6">
            {blog ? "Edit Blog" : "Add New Blog"}
          </h2>
          <button type="button" onClick={onClose}>
            <IoCloseOutline className="text-xl cursor-pointer" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block mb-1.5 text-[#020817] text-sm font-semibold">
            Title <span className="text-red-600">*</span>
          </label>
          <InputField
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="border p-2 rounded w-full"
          />
          <label className="block mb-1.5 text-[#020817] text-sm font-semibold">
            Subtitle <span className="text-red-600">*</span>
          </label>
          <InputField
            type="text"
            placeholder="Subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            required
            className="border p-2 w-full rounded"
          />
          <label className="block mb-1.5 text-[#020817] text-sm font-semibold">
            Description <span className="text-red-600">*</span>
          </label>
          <InputField
            placeholder="Description"
            as="textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="border p-2 w-full rounded"
          />
          <label className="block mb-1.5 text-[#020817] text-sm font-semibold">
            File <span className="text-red-600">*</span>
          </label>
          <InputField
            type="file"
            onChange={(e) =>
              setImageFile(e.target.files ? e.target.files[0] : null)
            }
            required
            className="border p-2 w-full rounded"
          />

          <button
            type="submit"
            className="px-4 py-2 mt-3 bg-[#02a6dd] text-white rounded w-full font-semibold cursor-pointer text-[14px]"
          >
            {blog ? "Update" : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
};
