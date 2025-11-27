"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { IPortfolio } from "@/types/IPortfolio";
import InputField from "./InputFilde";
import { IoCloseOutline } from "react-icons/io5";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  image: IPortfolio | null;
  onSaved: () => void;
}

const API_URL = "http://localhost:5000/api/images";

const PortfolioModal: React.FC<Props> = ({
  isOpen,
  onClose,
  image,
  onSaved,
}) => {
  const [altText, setAltText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      if (image) {
        setAltText(image.alt || "");
        setPreview(image.imageUrl || "");
      } else {
        setAltText("");
        setPreview("");
        setFile(null);
      }
    }
  }, [isOpen, image]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!altText) {
      alert("Alt text is required");
      return;
    }

    const formData = new FormData();
    formData.append("alt", altText);
    if (file) formData.append("image", file);

    try {
      if (image && (image._id || image.id)) {
        const id = image._id || image.id;
        await axios.put(`${API_URL}/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(API_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      onSaved();

      setAltText("");
      setFile(null);
      setPreview("");

      onClose();
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to save image");
    }
  };

  return (
    <div className="fixed inset-0 bg-[#333333ec] flex justify-center items-center z-50">
      <div className="bg-[#e8ebf0]  rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <div className="flex justify-between">
          <h2 className="text-lg font-medium mb-6">
            {image ? "Edit Image" : "Add New Image"}
          </h2>

          <button
            type="button"
            onClick={() => {
              setAltText("");
              setFile(null);
              setPreview("");
              onClose();
            }}
          >
            <IoCloseOutline className="text-xl cursor-pointer" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded mb-2"
            />
          )}

          <div>
            <label className="block mb-1.5 text-[#020817] text-sm font-semibold">
              Image <span className="text-red-600">*</span>
            </label>
            <InputField
              key={preview}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0] || null;
                setFile(f);
                if (f) setPreview(URL.createObjectURL(f));
              }}
              className="border p-2 w-full rounded"
            />
          </div>

          <div>
            <label className="block mb-1.5 text-[#020817] text-sm font-semibold">
              Alt Text <span className="text-red-600">*</span>
            </label>
            <InputField
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              className="border p-2 w-full rounded"
              placeholder="Enter image alt text"
              required
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 mt-3 bg-[#02a6dd] text-white rounded w-full font-semibold cursor-pointer text-[14px]"
          >
            {image ? "Update" : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PortfolioModal;
