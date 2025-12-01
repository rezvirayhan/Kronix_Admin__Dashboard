"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { IBlog } from "@/app/dashboard/blogs/page";
import InputField from "../components/InputFilde";
import { IoCloseOutline } from "react-icons/io5";
import { toast } from "react-toastify";
interface Props {
  isOpen: boolean;
  onClose: () => void;
  blog: IBlog | null;
  onSaved: () => void;
}
const API_URL = "https://kronix-back-end-kappa.vercel.app/api/blogs";
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
  const [previewImage, setPreviewImage] = useState<string>("");

  useEffect(() => {
    if (blog) {
      setTitle(blog.title || "");
      setSubtitle(blog.subtitle || "");
      setDescription(blog.description || "");
      setPreviewImage(blog.image || "");
      setImageFile(null);
    } else {
      setTitle("");
      setSubtitle("");
      setDescription("");
      setImageFile(null);
      setPreviewImage("");
    }
  }, [blog, isOpen]);

  if (!isOpen) return null;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title)
      return toast.error("Title is required", { position: "bottom-right" });
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
        toast.success("Blog updated successfully!", {
          position: "bottom-right",
        });
      } else {
        await axios.post(API_URL, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Blog created successfully!", {
          position: "bottom-right",
        });
      }
      onSaved();
      onClose();
      setTitle("");
      setSubtitle("");
      setDescription("");
      setImageFile(null);
      setPreviewImage("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save blog!", {
        position: "bottom-right",
      });
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

          <div className="space-y-2">
            <label className="block mb-1.5 text-[#020817] text-sm font-semibold">
              File <span className="text-red-600">*</span>
            </label>
            <div className="border p-3 rounded w-full bg-white flex flex-col gap-3">
              {previewImage && (
                <div className="w-full flex justify-center">
                  <div className="relative group w-28 h-28">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg shadow-md border border-gray-200 transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </div>
              )}
              <InputField
                type="file"
                onChange={(e) => {
                  const target = e.target as HTMLInputElement;
                  const file = target.files ? target.files[0] : null;
                  setImageFile(file);
                  if (file) setPreviewImage(URL.createObjectURL(file));
                }}
                required={!blog}
                className="border p-2 w-full rounded cursor-pointer"
              />
            </div>
          </div>
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
