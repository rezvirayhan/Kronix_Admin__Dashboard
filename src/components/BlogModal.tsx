"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { IBlog } from "@/app/dashboard/blogs/page";

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
  }, [blog]);

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
    } catch (err) {
      console.error(err);
      alert("Failed to save blog");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          {blog ? "Edit Blog" : "Add New Blog"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="border p-2 w-full rounded"
          />
          <input
            type="text"
            placeholder="Subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="border p-2 w-full rounded"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 w-full rounded"
          />
          <input
            type="file"
            onChange={(e) =>
              setImageFile(e.target.files ? e.target.files[0] : null)
            }
            className="border p-2 w-full rounded"
          />
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {blog ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
