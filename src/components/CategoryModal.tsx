"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { IOurCategory, IOption } from "@/types/IOurCategory";
import { IoCloseOutline } from "react-icons/io5";
import InputField from "./InputFilde";
import { toast } from "react-toastify";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  category?: IOurCategory | null;
  onSaved: () => void;
}

const categories = [
  "Web design & UI",
  "Social media visuals",
  "Infographics",
  "Design system",
  "Email design",
  "Stationery",
  "Icons",
  "Packaging & merch",
  "Signage",
  "Brochures",
  "Logos & branding",
  "Digital ads",
  "Wireframes",
];

const API = "http://localhost:5000/api/services";
console.log(API);
const CategoryModal: React.FC<Props> = ({
  isOpen,
  onClose,
  category,
  onSaved,
}) => {
  const [categoryName, setCategoryName] = useState(categories[0]);
  const [headingSubtitle, setHeadingSubtitle] = useState("");
  const [headingTitle, setHeadingTitle] = useState("");
  const [headingDescription, setHeadingDescription] = useState("");
  const [options, setOptions] = useState<IOption[]>([
    { option_title: "", option_subtitle: "", icon: "" },
  ]);
  const [icons, setIcons] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setCategoryName(category.category);
      setHeadingSubtitle(category.heading_subtitle);
      setHeadingTitle(category.heading_title);
      setHeadingDescription(category.heading_description);
      setOptions(
        category.options?.map((opt) => ({ ...opt, icon: "" })) || [
          { option_title: "", option_subtitle: "", icon: "" },
        ]
      );
      setIcons([]);
    } else {
      resetForm();
    }
  }, [category, isOpen]);

  const handleOptionChange = (
    index: number,
    field: keyof IOption,
    value: string
  ) => {
    const updatedOptions = [...options];
    updatedOptions[index][field] = value;
    setOptions(updatedOptions);
  };

  const handleIconChange = (index: number, file: File) => {
    const updatedOptions = [...options];
    updatedOptions[index].iconFile = file;
    setOptions(updatedOptions);
  };

  const handleAddOption = () => {
    setOptions([
      ...options,
      { option_title: "", option_subtitle: "", icon: "" },
    ]);
    setIcons([...icons, new File([], "")]);
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
    setIcons(icons.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setCategoryName(categories[0]);
    setHeadingSubtitle("");
    setHeadingTitle("");
    setHeadingDescription("");
    setOptions([{ option_title: "", option_subtitle: "", icon: "" }]);
    setIcons([]);
  };

  const handleSubmit = async () => {
    if (!categoryName || !headingTitle) {
      return toast.error("Please fill required fields");
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("category", categoryName);
    formData.append("heading_subtitle", headingSubtitle);
    formData.append("heading_title", headingTitle);
    formData.append("heading_description", headingDescription);

    options.forEach((opt, idx) => {
      formData.append(`options[${idx}][option_title]`, opt.option_title);
      formData.append(`options[${idx}][option_subtitle]`, opt.option_subtitle);
      if (opt.iconFile) formData.append("icons", opt.iconFile);
      else formData.append(`options[${idx}][icon]`, opt.icon);
    });

    try {
      if (category?._id) {
        await axios.put(`${API}/${category._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Category updated successfully!", {
          position: "bottom-right",
        });
      } else {
        await axios.post(API, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Category saved successfully!", {
          position: "bottom-right",
        });
      }

      resetForm();
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save category", { position: "bottom-right" });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#333333ec] flex items-center justify-center z-50 overflow-scroll">
      <div className="bg-[#e8ebf0] p-6 w-1/2 rounded shadow-lg">
        <div className="flex justify-between">
          <h2 className="text-lg font-medium mb-6">
            {category?._id ? "Edit Category" : "Add Category"}
          </h2>
          <button type="button" onClick={onClose}>
            <IoCloseOutline className="text-xl cursor-pointer" />
          </button>
        </div>

        <div className="flex justify-between gap-5">
          <div className="w-full">
            <label className="block mb-1.5 text-[#020817] text-sm font-semibold">
              Category <span className="text-red-600">*</span>
            </label>
            <InputField
              as="select"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              options={categories}
              placeholder="Select Category"
              required
            />
          </div>
          <div className="w-full">
            <label className="block mb-1.5 text-[#020817] text-sm font-semibold">
              Heading Subtitle <span className="text-red-600">*</span>
            </label>
            <InputField
              type="text"
              placeholder="Heading Subtitle"
              value={headingSubtitle}
              onChange={(e) => setHeadingSubtitle(e.target.value)}
              required
            />
          </div>
          <div className="w-full">
            <label className="block mb-1.5 text-[#020817] text-sm font-semibold">
              Heading Title <span className="text-red-600">*</span>
            </label>
            <InputField
              type="text"
              placeholder="Heading Title"
              value={headingTitle}
              onChange={(e) => setHeadingTitle(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="w-full mt-4">
          <label className="block mb-1.5 text-[#020817] text-sm font-semibold">
            Heading Description <span className="text-red-600">*</span>
          </label>
          <InputField
            as="textarea"
            placeholder="Heading Description"
            value={headingDescription}
            onChange={(e) => setHeadingDescription(e.target.value)}
            required
          />
        </div>

        <h3 className="text-md font-semibold mt-2 mb-2">Options</h3>
        <div className="flex flex-col gap-4 overflow-y-auto pr-2 max-h-[45vh]">
          {options.map((opt, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg bg-white shadow-sm border border-gray-200"
            >
              <div className="flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[180px]">
                  <label className="block mb-1 text-sm font-semibold text-gray-800">
                    Option Title
                  </label>
                  <InputField
                    type="text"
                    placeholder="Option Title"
                    value={opt.option_title}
                    onChange={(e) =>
                      handleOptionChange(idx, "option_title", e.target.value)
                    }
                  />
                </div>
                <div className="flex-1 min-w-[180px]">
                  <label className="block mb-1 text-sm font-semibold text-gray-800">
                    Option Subtitle
                  </label>
                  <InputField
                    type="text"
                    placeholder="Option Subtitle"
                    value={opt.option_subtitle}
                    onChange={(e) =>
                      handleOptionChange(idx, "option_subtitle", e.target.value)
                    }
                  />
                </div>
                <div className="flex-1 min-w-[180px]">
                  <label className="block mb-1 text-sm font-semibold text-gray-800">
                    Image
                  </label>
                  <InputField
                    type="file"
                    onChange={(e) =>
                      e.target.files && handleIconChange(idx, e.target.files[0])
                    }
                  />
                </div>
                {options.length > 1 && (
                  <div className="mt-4">
                    <button
                      onClick={() => handleRemoveOption(idx)}
                      className="px-3 py-1 text-xs rounded-full border border-red-400 text-red-500 hover:bg-red-50 transition"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleAddOption}
          className="px-3 py-1 text-xs rounded cursor-pointer border bg-green-600 text-white border-gray-400 mt-2"
        >
          Add Option
        </button>

        <button
          onClick={handleSubmit}
          className="px-4 py-2 mt-7 bg-[#02a6dd] text-white rounded w-full font-semibold cursor-pointer text-[14px]"
        >
          {category ? "Update" : "Save"}
        </button>
      </div>
    </div>
  );
};

export default CategoryModal;
