"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoCloseOutline } from "react-icons/io5";
import InputField from "../components/InputFilde";

interface IBanner {
  _id?: string;
  mainTitle: string;
  highlight: string;
  subtitle: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  banner?: IBanner | null;
  onSaved: () => void;
}

const BannerModal: React.FC<Props> = ({ isOpen, onClose, banner, onSaved }) => {
  const [form, setForm] = useState<IBanner>({
    mainTitle: "",
    highlight: "",
    subtitle: "",
  });

  useEffect(() => {
    if (banner) {
      setForm({
        mainTitle: banner.mainTitle || "",
        highlight: banner.highlight || "",
        subtitle: banner.subtitle || "",
      });
    } else if (isOpen) {
      setForm({
        mainTitle: "",
        highlight: "",
        subtitle: "",
      });
    }
  }, [banner, isOpen]);

  const updateField = (key: keyof IBanner, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (banner?._id) {
        await axios.put(`http://localhost:5000/api/hero/${banner._id}`, form);
      } else {
        await axios.post("http://localhost:5000/api/hero", form);
      }
      setForm({
        mainTitle: "",
        highlight: "",
        subtitle: "",
      });
      onSaved();
      onClose();
    } catch (err: any) {
      console.error("Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Bad Request");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#333333ec] flex items-center justify-center z-50 overflow-auto">
      <div className="bg-[#e8ebf0]  p-6 rounded-lg shadow w-full max-w-xl space-y-4">
        <div className="flex justify-between">
          <h2 className="text-lg font-medium mb-6">
            {banner?._id ? "Edit Banner" : "Add Banner"}
          </h2>
          <button type="button" onClick={onClose}>
            <IoCloseOutline className="text-xl cursor-pointer" />
          </button>
        </div>

        <label className="block mb-1.5 text-[#020817] text-sm font-semibold">
          Main Title <span className="text-red-600">*</span>
        </label>
        <InputField
          type="text"
          placeholder="Main Title"
          value={form.mainTitle}
          onChange={(e) => updateField("mainTitle", e.target.value)}
          required
          className="border p-2 rounded w-full"
        />

        <label className="block mb-1.5 text-[#020817] text-sm font-semibold">
          Highlight <span className="text-red-600">*</span>
        </label>
        <InputField
          type="text"
          placeholder="Highlight"
          value={form.highlight}
          onChange={(e) => updateField("highlight", e.target.value)}
          required
          className="border p-2 rounded w-full"
        />

        <label className="block mb-1.5 text-[#020817] text-sm font-semibold">
          Subtitle <span className="text-red-600">*</span>
        </label>
        <InputField
          type="text"
          as="textarea"
          placeholder="Subtitle"
          value={form.subtitle}
          onChange={(e) => updateField("subtitle", e.target.value)}
          required
          className="border p-2 rounded w-full"
        />

        <button
          className="px-4 py-2 mt-3 bg-[#02a6dd] text-white rounded w-full font-semibold cursor-pointer text-[14px]"
          onClick={handleSubmit}
        >
          {banner?._id ? "Update" : "Add"}
        </button>
      </div>
    </div>
  );
};

export default BannerModal;
