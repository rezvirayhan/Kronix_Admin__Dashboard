"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ITestimonial } from "@/pages/admin/TestimonialDashboard";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  testimonial: ITestimonial | null;
  onSaved: () => void;
}

const API_URL = "http://localhost:5000/api/testimonials";

const TestimonialModal: React.FC<Props> = ({
  isOpen,
  onClose,
  testimonial,
  onSaved,
}) => {
  const [form, setForm] = useState<Partial<ITestimonial>>({
    companyName: "",
    name: "",
    title: "",
    titleReview: "",
    reviewDescription: "",
  });
  const [companyLogoFile, setCompanyLogoFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (testimonial) {
      setForm({ ...testimonial });
      setCompanyLogoFile(null);
      setImageFile(null);
    } else {
      setForm({
        companyName: "",
        name: "",
        title: "",
        titleReview: "",
        reviewDescription: "",
      });
      setCompanyLogoFile(null);
      setImageFile(null);
    }
  }, [testimonial]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) data.append(key, value as string);
    });
    if (companyLogoFile) data.append("companyLogo", companyLogoFile);
    if (imageFile) data.append("image", imageFile);

    try {
      if (testimonial && testimonial._id) {
        await axios.put(`${API_URL}/${testimonial._id}`, data, {
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
      alert("Failed to save testimonial");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          {testimonial ? "Edit Testimonial" : "Add Testimonial"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Company Name"
            value={form.companyName}
            onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            required
            className="border p-2 w-full rounded"
          />
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="border p-2 w-full rounded"
          />
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            className="border p-2 w-full rounded"
          />
          <textarea
            placeholder="Title Review"
            value={form.titleReview}
            onChange={(e) => setForm({ ...form, titleReview: e.target.value })}
            required
            className="border p-2 w-full rounded"
          />
          <textarea
            placeholder="Review Description"
            value={form.reviewDescription}
            onChange={(e) =>
              setForm({ ...form, reviewDescription: e.target.value })
            }
            required
            className="border p-2 w-full rounded"
          />
          <input
            type="file"
            onChange={(e) =>
              setCompanyLogoFile(e.target.files ? e.target.files[0] : null)
            }
          />
          <input
            type="file"
            onChange={(e) =>
              setImageFile(e.target.files ? e.target.files[0] : null)
            }
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
              {testimonial ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TestimonialModal;
