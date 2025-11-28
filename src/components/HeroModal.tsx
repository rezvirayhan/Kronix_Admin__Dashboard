"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { IoCloseOutline } from "react-icons/io5";
import InputField from "./InputFilde";
import { toast } from "react-toastify";

export interface HeroStep {
  title: string;
  description: string;
  image: File | string | null; // File when uploading, string when existing
}

export interface Hero {
  _id?: string;
  mainTitle: string;
  description: string;
  steps: HeroStep[];
}

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
    if (hero) {
      setForm({
        mainTitle: hero.mainTitle,
        description: hero.description,
        steps: hero.steps.map((s) => ({ ...s })),
      });
    }
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
        form.steps.map((s) => ({
          title: s.title,
          description: s.description,
        }))
      )
    );

    form.steps.forEach((step, index) => {
      if (step.image instanceof File) {
        data.append(`stepImage_${index}`, step.image);
      }
    });

    try {
      if (hero && hero._id) {
        await axios.put(`${API_URL}/${hero._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Hero Update successfully!");
      } else {
        await axios.post(API_URL, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Hero Update successfully!");
      }
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save hero");
    }
  };

  return (
    <div className="fixed inset-0 bg-[#333333ec] flex justify-center items-center z-50 p-4 overflow-auto">
      <div className="bg-[#e8ebf0] rounded-lg shadow-lg w-full md:w-2/4 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium">
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

          <div>
            <label className="block mb-1.5 text-[#020817] text-sm font-semibold">
              Description <span className="text-red-600">*</span>
            </label>
            <InputField
              as="textarea"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              required
              className="border p-2 w-full rounded resize-none h-24"
            />
          </div>

          {form.steps.map((step, index) => (
            <div key={index} className=" p-4 rounded space-y-3">
              <div className="grid grid-cols-3 gap-5">
                <div>
                  <label className="block mb-1.5 text-[#020817] text-sm font-semibold">
                    Step {index + 1} Title{" "}
                    <span className="text-red-600">*</span>
                  </label>
                  <InputField
                    type="text"
                    placeholder={`Step ${index + 1} Title`}
                    value={step.title}
                    onChange={(e) =>
                      handleStepChange(index, "title", e.target.value)
                    }
                    required
                    className="border p-2 w-full rounded"
                  />
                </div>

                <div>
                  <label className="block mb-1.5 text-[#020817] text-sm font-semibold">
                    Step {index + 1} Description{" "}
                    <span className="text-red-600">*</span>
                  </label>
                  <InputField
                    placeholder={`Step ${index + 1} Description`}
                    value={step.description}
                    onChange={(e) =>
                      handleStepChange(index, "description", e.target.value)
                    }
                    required
                    className="border p-2 w-full rounded "
                  />
                </div>

                <div>
                  <label className="block mb-1.5 text-[#020817] text-sm font-semibold">
                    Step {index + 1} Image
                  </label>
                  <InputField
                    type="file"
                    name={`stepImage_${index}`}
                    className="border p-2 rounded"
                    onChange={(e) =>
                      handleStepChange(
                        index,
                        "image",
                        e.target.files ? e.target.files[0] : null
                      )
                    }
                  />
                </div>
              </div>
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
