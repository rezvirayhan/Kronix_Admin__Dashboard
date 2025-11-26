"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { IOurCategory, IOption } from "@/types/IOurCategory";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  item: IOurCategory | null;
  onSaved: () => void;
  apiUrl: string;
}

const OurCategoryModal: React.FC<Props> = ({
  isOpen,
  onClose,
  item,
  onSaved,
  apiUrl,
}) => {
  const defaultOption = {
    option_title: "",
    option_subtitle: "",
    iconFile: null,
  } as IOption;
  const [category, setCategory] = useState(item?.category || "");
  const [headingSubtitle, setHeadingSubtitle] = useState(
    item?.heading_subtitle || ""
  );
  const [headingTitle, setHeadingTitle] = useState(item?.heading_title || "");
  const [headingDescription, setHeadingDescription] = useState(
    item?.heading_description || ""
  );
  const [options, setOptions] = useState<IOption[]>(
    item?.options?.map((o) => ({ ...o })) || [defaultOption]
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setCategory(item.category);
      setHeadingSubtitle(item.heading_subtitle);
      setHeadingTitle(item.heading_title);
      setHeadingDescription(item.heading_description);
      setOptions(item.options.map((o) => ({ ...o, iconFile: null })));
    } else {
      setCategory("");
      setHeadingSubtitle("");
      setHeadingTitle("");
      setHeadingDescription("");
      setOptions([defaultOption]);
    }
  }, [item]);

  if (!isOpen) return null;

  const handleOptionChange = (
    idx: number,
    field: keyof IOption,
    value: any
  ) => {
    const copy = [...options];
    (copy[idx] as any)[field] = value;
    setOptions(copy);
  };

  const addOption = () => setOptions((prev) => [...prev, { ...defaultOption }]);
  const removeOption = (idx: number) =>
    setOptions((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return alert("Category is required");
    if (!headingTitle) return alert("Heading title is required");

    setLoading(true);
    try {
      const form = new FormData();
      form.append("category", category);
      form.append("heading_subtitle", headingSubtitle);
      form.append("heading_title", headingTitle);
      form.append("heading_description", headingDescription);

      options.forEach((opt, index) => {
        form.append(`options[${index}][option_title]`, opt.option_title || "");
        form.append(
          `options[${index}][option_subtitle]`,
          opt.option_subtitle || ""
        );
        if (opt.iconFile instanceof File) {
          form.append("icons", opt.iconFile);
        }
      });

      if (item && item._id) {
        await axios.put(`${apiUrl}/${item._id}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(apiUrl, form, {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl bg-white rounded shadow-lg overflow-auto max-h-[90vh] p-6">
        <h2 className="text-xl font-semibold mb-4">
          {item ? "Edit Category" : "Add Category"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Category</label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Heading Subtitle
            </label>
            <input
              value={headingSubtitle}
              onChange={(e) => setHeadingSubtitle(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Heading Title</label>
            <input
              value={headingTitle}
              onChange={(e) => setHeadingTitle(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Heading Description
            </label>
            <textarea
              value={headingDescription}
              onChange={(e) => setHeadingDescription(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Options</label>
            <div className="space-y-3">
              {options.map((opt, i) => (
                <div key={i} className="border rounded p-3">
                  <div className="flex justify-between items-center mb-2">
                    <strong>Option {i + 1}</strong>
                    {options.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeOption(i)}
                        className="text-sm text-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <input
                    placeholder="Option Title"
                    value={opt.option_title || ""}
                    onChange={(e) =>
                      handleOptionChange(i, "option_title", e.target.value)
                    }
                    className="w-full border p-2 rounded mb-2"
                  />
                  <input
                    placeholder="Option Subtitle"
                    value={opt.option_subtitle || ""}
                    onChange={(e) =>
                      handleOptionChange(i, "option_subtitle", e.target.value)
                    }
                    className="w-full border p-2 rounded mb-2"
                  />

                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleOptionChange(
                          i,
                          "iconFile",
                          e.target.files ? e.target.files[0] : null
                        )
                      }
                    />
                    {opt.icon && !opt.iconFile && (
                      <img
                        src={opt.icon}
                        alt="icon"
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    {opt.iconFile && (
                      <img
                        src={URL.createObjectURL(opt.iconFile)}
                        alt="preview"
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2">
              <button
                type="button"
                onClick={addOption}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                Add Option
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {loading ? "Saving..." : item ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OurCategoryModal;
