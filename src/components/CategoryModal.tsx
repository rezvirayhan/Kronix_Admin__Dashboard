"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { IOurCategory, IOption } from "@/types/IOurCategory";

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

const API = "http://localhost:5000/api/ctgory";

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
      setCategoryName(categories[0]);
      setHeadingSubtitle("");
      setHeadingTitle("");
      setHeadingDescription("");
      setOptions([{ option_title: "", option_subtitle: "", icon: "" }]);
      setIcons([]);
    }
  }, [category]);

  const handleOptionChange = (
    index: number,
    field: keyof IOption,
    value: string
  ) => {
    const updated = [...options];
    updated[index][field] = value;
    setOptions(updated);
  };

  const handleIconChange = (index: number, file: File) => {
    const updated = [...options];
    updated[index].icon = file.name; // optional for preview
    setOptions(updated);

    const updatedFiles = [...icons];
    updatedFiles[index] = file;
    setIcons(updatedFiles);
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

  const handleSubmit = async () => {
    if (!categoryName || !headingTitle)
      return alert("Please fill required fields");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("category", categoryName);
      formData.append("heading_subtitle", headingSubtitle);
      formData.append("heading_title", headingTitle);
      formData.append("heading_description", headingDescription);

      options.forEach((opt, idx) => {
        formData.append(`options[${idx}][option_title]`, opt.option_title);
        formData.append(
          `options[${idx}][option_subtitle]`,
          opt.option_subtitle
        );
        if (icons[idx]) {
          formData.append("icons", icons[idx]); // backend expects "icons" array
        }
      });

      if (category?._id) {
        await axios.put(`${API}/${category._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(API, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 w-full max-w-lg rounded shadow-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-4">
          {category?._id ? "Edit Category" : "Add Category"}
        </h2>

        <select
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Heading Subtitle"
          value={headingSubtitle}
          onChange={(e) => setHeadingSubtitle(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Heading Title"
          value={headingTitle}
          onChange={(e) => setHeadingTitle(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />
        <textarea
          placeholder="Heading Description"
          value={headingDescription}
          onChange={(e) => setHeadingDescription(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />

        <h3 className="mt-2 font-bold">Options</h3>
        {options.map((opt, idx) => (
          <div key={idx} className="mb-2 border p-2 rounded">
            <input
              type="text"
              placeholder="Option Title"
              value={opt.option_title}
              onChange={(e) =>
                handleOptionChange(idx, "option_title", e.target.value)
              }
              className="w-full mb-1 p-1 border rounded"
            />
            <input
              type="text"
              placeholder="Option Subtitle"
              value={opt.option_subtitle}
              onChange={(e) =>
                handleOptionChange(idx, "option_subtitle", e.target.value)
              }
              className="w-full mb-1 p-1 border rounded"
            />
            <input
              type="file"
              onChange={(e) =>
                e.target.files && handleIconChange(idx, e.target.files[0])
              }
              className="w-full mb-1 p-1 border rounded"
            />
            {options.length > 1 && (
              <button
                onClick={() => handleRemoveOption(idx)}
                className="text-red-500 text-sm mt-1"
              >
                Remove
              </button>
            )}
          </div>
        ))}

        <button
          onClick={handleAddOption}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
        >
          Add Option
        </button>

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
