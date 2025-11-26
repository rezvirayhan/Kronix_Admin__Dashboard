"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { IPortfolio } from "@/types/IPortfolio";

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
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <h2 className="text-xl font-semibold mb-4">
          {image ? "Edit Image" : "Add New Image"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded mb-2"
            />
          )}

          <div>
            <label className="block mb-1 font-medium">Image</label>
            <input
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
            <label className="block mb-1 font-medium">Alt Text</label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              className="border p-2 w-full rounded"
              placeholder="Enter image alt text"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => {
                setAltText("");
                setFile(null);
                setPreview("");
                onClose();
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {image ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PortfolioModal;
