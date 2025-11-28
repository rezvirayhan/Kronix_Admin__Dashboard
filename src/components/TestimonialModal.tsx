"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ITestimonial } from "@/app/dashboard/testimonial/page";
import InputField from "./InputFilde";
import { IoCloseOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  const resetForm = () => {
    setForm({
      companyName: "",
      name: "",
      title: "",
      titleReview: "",
      reviewDescription: "",
    });
    setCompanyLogoFile(null);
    setImageFile(null);
  };

  useEffect(() => {
    if (testimonial) {
      setForm({ ...testimonial });
      setCompanyLogoFile(null);
      setImageFile(null);
    } else {
      resetForm();
    }
  }, [testimonial, isOpen]);

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
        toast.success("Testimonial updated successfully!", {
          position: "bottom-right",
        });
      } else {
        await axios.post(API_URL, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Testimonial created successfully!", {
          position: "bottom-right",
        });
      }
      onSaved();
      onClose();
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save testimonial.", { position: "top-right" });
    }
  };

  return (
    <div className="fixed inset-0 bg-[#333333ec] flex justify-center items-center z-50">
      <div className="bg-[#e8ebf0] rounded-lg shadow-lg w-2/5 p-6">
        <div className="flex justify-between">
          <h2 className="text-lg font-medium mb-6">
            {testimonial ? "Edit Testimonial" : "Add Testimonial"}
          </h2>
          <button
            type="button"
            onClick={() => {
              onClose();
              resetForm();
            }}
          >
            <IoCloseOutline className="text-xl cursor-pointer" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-5">
            <div className="w-full">
              <label className="block mb-1.5 text-[#020817] text-sm font-semibold">
                Company Name <span className="text-red-600">*</span>
              </label>
              <InputField
                type="text"
                placeholder="Company Name"
                value={form.companyName}
                onChange={(e) =>
                  setForm({ ...form, companyName: e.target.value })
                }
                required
              />
            </div>
            <div className="w-full">
              <label className="block mb-1.5 text-[#020817] text-sm font-semibold">
                Your Name <span className="text-red-600">*</span>
              </label>
              <InputField
                type="text"
                placeholder="Your Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex gap-5">
            <div className="w-full">
              <label className="block mb-1.5 text-[#020817] text-sm font-semibold">
                Review Heading <span className="text-red-600">*</span>
              </label>
              <InputField
                type="text"
                placeholder="Review Heading"
                value={form.titleReview}
                onChange={(e) =>
                  setForm({ ...form, titleReview: e.target.value })
                }
                required
              />
            </div>
            <div className="w-full">
              <label className="block mb-1.5 text-[#020817] text-sm font-semibold">
                Designation <span className="text-red-600">*</span>
              </label>
              <InputField
                type="text"
                placeholder="Your Designation"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex gap-5">
            <div className="w-full">
              <label className="block mb-1.5 text-[#020817] text-sm font-semibold">
                Company Logo <span className="text-red-600">*</span>
              </label>
              <InputField
                type="file"
                onChange={(e) =>
                  setCompanyLogoFile(e.target.files ? e.target.files[0] : null)
                }
              />
            </div>
            <div className="w-full">
              <label className="block mb-1.5 text-[#020817] text-sm font-semibold">
                Image <span className="text-red-600">*</span>
              </label>
              <InputField
                type="file"
                onChange={(e) =>
                  setImageFile(e.target.files ? e.target.files[0] : null)
                }
              />
            </div>
          </div>
          <InputField
            label="Review Description"
            placeholder="Review Description"
            as="textarea"
            value={form.reviewDescription}
            onChange={(e) =>
              setForm({ ...form, reviewDescription: e.target.value })
            }
            required
          />

          <button
            type="submit"
            className="px-4 py-2 mt-3 bg-[#02a6dd] text-white rounded w-full font-semibold cursor-pointer text-[14px]"
          >
            {testimonial ? "Update" : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TestimonialModal;
