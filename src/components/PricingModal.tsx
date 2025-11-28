"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { IPricing } from "@/types/IPricing";
import InputField from "./InputFilde";
import { IoCloseOutline } from "react-icons/io5";
import { toast } from "react-toastify";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  pricing?: IPricing | null;
  onSaved: () => void;
}

interface FormState {
  pricing: string;
  priceTitle: string;
  pricingPackage: string;
  description: string;
  price: string;
  options: string[];
}

const initialFormState: FormState = {
  pricing: "",
  priceTitle: "",
  pricingPackage: "",
  description: "",
  price: "",
  options: [""],
};

const PricingModal: React.FC<Props> = ({
  isOpen,
  onClose,
  pricing,
  onSaved,
}) => {
  const [form, setForm] = useState<FormState>(initialFormState);

  useEffect(() => {
    if (pricing) {
      setForm({
        pricing: pricing.pricing || "",
        priceTitle: pricing.priceTitle || "",
        pricingPackage: pricing.pricingPackage || "",
        description: pricing.description || "",
        price: pricing.price?.toString() || "",
        options: pricing.options?.length ? pricing.options : [""],
      });
    } else if (isOpen) {
      setForm(initialFormState);
    }
  }, [pricing, isOpen]);

  const updateField = (key: keyof FormState, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const updateOption = (index: number, value: string) => {
    const newOptions = [...form.options];
    newOptions[index] = value;
    updateField("options", newOptions);
  };

  const addOption = () => updateField("options", [...form.options, ""]);

  const removeOption = (index: number) =>
    updateField(
      "options",
      form.options.filter((_, i) => i !== index)
    );

  const handleSubmit = async () => {
    try {
      const payload = {
        pricing: form.pricing,
        priceTitle: form.priceTitle,
        pricingPackage: form.pricingPackage,
        description: form.description,
        price: Number(form.price),
        options: form.options.filter((o) => o.trim() !== ""),
      };

      if (pricing?._id) {
        await axios.put(
          `http://localhost:5000/api/pricing/${pricing._id}`,
          payload
        );
        toast.success("Pricing updated successfully!", {
          position: "bottom-right",
        });
      } else {
        await axios.post("http://localhost:5000/api/pricing", payload);
        toast.success("Pricing saved successfully!", {
          position: "bottom-right",
        });
      }

      setForm(initialFormState);
      onSaved();
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong!", {
        position: "bottom-right",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-[#333333ec] flex items-center justify-center z-50 overflow-scroll">
        <div className="bg-[#e8ebf0] p-6 w-1/2 rounded shadow-lg">
          <div className="flex justify-between mb-6">
            <h2 className="text-lg font-medium">
              {pricing?._id ? "Edit Pricing" : "Add Pricing"}
            </h2>
            <button type="button" onClick={onClose}>
              <IoCloseOutline className="text-xl cursor-pointer" />
            </button>
          </div>

          <div className="flex flex-wrap gap-5 mb-4">
            <div className="flex-1">
              <label className="block mb-1.5 text-sm font-semibold text-[#020817]">
                Pricing <span className="text-red-600">*</span>
              </label>
              <InputField
                type="text"
                placeholder="Pricing"
                value={form.pricing}
                onChange={(e) => updateField("pricing", e.target.value)}
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1.5 text-sm font-semibold text-[#020817]">
                Price Title <span className="text-red-600">*</span>
              </label>
              <InputField
                type="text"
                placeholder="Price Title"
                value={form.priceTitle}
                onChange={(e) => updateField("priceTitle", e.target.value)}
                className="border p-2 rounded w-full"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-5 mb-4">
            <div className="flex-1">
              <label className="block mb-1.5 text-sm font-semibold text-[#020817]">
                Package <span className="text-red-600">*</span>
              </label>
              <InputField
                type="text"
                placeholder="Package"
                value={form.pricingPackage}
                onChange={(e) => updateField("pricingPackage", e.target.value)}
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1.5 text-sm font-semibold text-[#020817]">
                Price <span className="text-red-600">*</span>
              </label>
              <InputField
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={(e) => updateField("price", e.target.value)}
                className="border p-2 rounded w-full"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-1.5 text-sm font-semibold text-[#020817]">
              Description <span className="text-red-600">*</span>
            </label>
            <InputField
              as="textarea"
              placeholder="Description"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>

          <h3 className="text-md font-semibold mb-2">Options</h3>
          <div className="flex flex-col gap-4 overflow-y-auto pr-2 max-h-[35vh]">
            {form.options.map((opt, i) => (
              <div
                key={i}
                className="p-4 rounded-lg bg-white shadow-sm border border-gray-200"
              >
                <div className="flex flex-wrap gap-4 items-end">
                  <div className="flex-1 min-w-[180px]">
                    <InputField
                      type="text"
                      value={opt}
                      onChange={(e) => updateOption(i, e.target.value)}
                      className="border p-2 rounded w-full"
                      placeholder="Option Title"
                    />
                  </div>
                  {form.options.length > 1 && (
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => removeOption(i)}
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
            type="button"
            onClick={addOption}
            className="px-3 py-1 text-xs rounded cursor-pointer border bg-green-600 text-white mt-2"
          >
            Add Option
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 mt-7 bg-[#02a6dd] text-white rounded w-full font-semibold cursor-pointer text-[14px]"
          >
            {pricing?._id ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </>
  );
};

export default PricingModal;
