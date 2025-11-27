"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Hero } from "@/app/dashboard/hero/page";
import { IoCloseOutline } from "react-icons/io5";
import InputField from "./InputFilde";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  hero: Hero | null;
  onSaved: () => void;
}

const API_URL = "http://localhost:5000/api/heroes";

const HeroModal: React.FC<Props> = ({ isOpen, onClose, hero, onSaved }) => {
  const [form, setForm] = useState<Hero>({
    mainTitle: "",
    description: "",
    steps: [
      { title: "", description: "", image: null },
      { title: "", description: "", image: null },
      { title: "", description: "", image: null },
    ],
  });

  useEffect(() => {
    if (hero) setForm(hero);
    else
      setForm({
        mainTitle: "",
        description: "",
        steps: [
          { title: "", description: "", image: null },
          { title: "", description: "", image: null },
          { title: "", description: "", image: null },
        ],
      });
  }, [hero]);

  if (!isOpen) return null;

  const handleStepChange = (
    index: number,
    field: "title" | "description" | "image",
    value: any
  ) => {
    const updatedSteps = [...form.steps];
    updatedSteps[index][field] = value;
    setForm({ ...form, steps: updatedSteps });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("mainTitle", form.mainTitle);
    data.append("description", form.description);
    data.append(
      "steps",
      JSON.stringify(
        form.steps.map((s) => ({ title: s.title, description: s.description }))
      )
    );

    form.steps.forEach((step, i) => {
      if (step.image instanceof File) data.append("images", step.image);
    });

    try {
      if (hero && hero._id) {
        await axios.put(`${API_URL}/${hero._id}`, data, {
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
      alert("Failed to save hero");
    }
  };

  return (
    <div className="fixed inset-0 bg-[#333333ec] flex justify-center items-center z-50">
      <div className="bg-[#e8ebf0] rounded-lg shadow-lg w-2/4 p-6 overflow-y-auto ">
        <div className="flex justify-between">
          <h2 className="text-lg font-medium mb-6">
            {hero ? "Edit Hero" : "Add Hero"}
          </h2>
          <button type="button" onClick={onClose}>
            <IoCloseOutline className="text-xl cursor-pointer" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1.5 text-[#020817] text-sm font-semibold">
              Main Title <span className="text-red-600">*</span>
            </label>
            <InputField
              type="text"
              placeholder="Main Title"
              value={form.mainTitle}
              onChange={(e) => setForm({ ...form, mainTitle: e.target.value })}
              required
              className="border p-2 w-full rounded"
            />
          </div>

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
            className="border p-2 w-full rounded"
          />

          {form.steps.map((step, index) => (
            <div key={index} className="border p-2 rounded space-y-2">
              <input
                type="text"
                placeholder={`Step ${index + 1} Title`}
                value={step.title}
                onChange={(e) =>
                  handleStepChange(index, "title", e.target.value)
                }
                className="border p-1 w-full rounded"
              />
              <textarea
                placeholder={`Step ${index + 1} Description`}
                value={step.description}
                onChange={(e) =>
                  handleStepChange(index, "description", e.target.value)
                }
                className="border p-1 w-full rounded"
              />
              <input
                type="file"
                name="images"
                onChange={(e) =>
                  handleStepChange(
                    index,
                    "image",
                    e.target.files ? e.target.files[0] : null
                  )
                }
              />
              {step.image && !(step.image instanceof File) && (
                <img
                  src={step.image as string}
                  alt={`Step ${index + 1}`}
                  className="w-24 h-24 object-cover"
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            className="px-4 py-2 mt-3 bg-[#02a6dd] text-white rounded w-full font-semibold cursor-pointer text-[14px]"
          >
            {hero ? "Update" : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default HeroModal;
