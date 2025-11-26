"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { IPricing } from "@/types/IPricing";
import InputField from "./InputFilde";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  pricing?: IPricing | null;
  onSaved: () => void;
}

const PricingModal: React.FC<Props> = ({
  isOpen,
  onClose,
  pricing,
  onSaved,
}) => {
  const [form, setForm] = useState({
    pricing: "",
    priceTitle: "",
    pricingPackage: "",
    description: "",
    price: "",
    options: [""],
  });

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
      setForm({
        pricing: "",
        priceTitle: "",
        pricingPackage: "",
        description: "",
        price: "",
        options: [""],
      });
    }
  }, [pricing, isOpen]);

  const updateField = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateOption = (i: number, value: string) => {
    const newOpts = [...form.options];
    newOpts[i] = value;
    updateField("options", newOpts);
  };

  const addOption = () => updateField("options", [...form.options, ""]);

  const removeOption = (i: number) =>
    updateField(
      "options",
      form.options.filter((_, idx) => idx !== i)
    );

  const handleSubmit = async () => {
    try {
      const sendData = {
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
          sendData
        );
      } else {
        await axios.post("http://localhost:5000/api/pricing", sendData);
      }
      setForm({
        pricing: "",
        priceTitle: "",
        pricingPackage: "",
        description: "",
        price: "",
        options: [""],
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
    <div className="fixed inset-0 bg-[#3b383857] bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
      <div className="bg-[#ebeff4] p-6 rounded-lg shadow w-full max-w-xl space-y-4">
        <h2 className="text-xl font-bold">
          {pricing?._id ? "Edit Pricing" : "Add Pricing"}
        </h2>

        <InputField
          label="Pricing"
          type="text"
          placeholder="Pricing"
          value={form.pricing}
          onChange={(e) => updateField("pricing", e.target.value)}
          className="border p-2 rounded w-full"
        />

        <InputField
          label="Price Title"
          type="text"
          placeholder="Price Title"
          value={form.priceTitle}
          onChange={(e) => updateField("priceTitle", e.target.value)}
          className="border p-2 rounded w-full"
        />

        <InputField
          label="Package"
          type="text"
          placeholder="Package"
          value={form.pricingPackage}
          onChange={(e) => updateField("pricingPackage", e.target.value)}
          className="border p-2 rounded w-full"
        />

        <InputField
          label="Description"
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          className="border p-2 rounded w-full"
        />

        <InputField
          label="Price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => updateField("price", e.target.value)}
          className="border p-2 rounded w-full"
        />

        <h3 className="font-semibold">Options</h3>
        {form.options.map((opt, i) => (
          <div key={i} className="flex gap-2">
            <InputField
              type="text"
              value={opt}
              onChange={(e) => updateOption(i, e.target.value)}
              className="border p-2 rounded flex-1"
            />
            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => removeOption(i)}
            >
              Remove
            </button>
          </div>
        ))}

        <button
          className="bg-blue-500 text-white px-3 py-1 rounded"
          onClick={addOption}
        >
          Add Option
        </button>

        <div className="flex justify-end gap-2 mt-4">
          <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
            Cancel
          </button>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
          >
            {pricing?._id ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;
