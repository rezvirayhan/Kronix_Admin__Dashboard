"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";

const API_URL = "https://kronix-back-end.vercel.app/api/services";

interface Option {
  _id: string;
  icon: string;
  option_title: string;
  option_subtitle: string;
}

interface Category {
  _id: string;
  category: string;
  heading_title: string;
  heading_subtitle: string;
  heading_description: string;
  options: Option[];
  createdAt: string;
  updatedAt: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  categoryId: string | null;
}

const ViewCategory: React.FC<Props> = ({ isOpen, onClose, categoryId }) => {
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    if (!categoryId) return;

    const fetchCategory = async () => {
      try {
        const res = await axios.get(`${API_URL}/${categoryId}`);
        setCategory(res.data);
        console.log(res.data);
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    };
    fetchCategory();
  }, [categoryId]);

  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 bg-[#333333cc] flex items-center justify-center z-50 overflow-auto p-4">
      <div className="bg-white w-full md:w-2/5 rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            {category.category}
          </h2>
          <button className="cursor-pointer" onClick={onClose}>
            <IoCloseOutline className="text-2xl text-gray-700 hover:text-gray-900" />
          </button>
        </div>

        <p className="text-gray-600 font-semibold">{category.heading_title}</p>
        <p className="text-gray-500 mb-4">{category.heading_subtitle}</p>
        <p className="text-gray-700 mb-6">{category.heading_description}</p>

        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {category.options.map((option, idx) => (
            <div
              key={option._id}
              className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 shadow-sm"
            >
              <img
                src={option.icon}
                alt={option.option_title}
                className="w-12 h-12 object-cover rounded"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {idx + 1}. {option.option_title}
                </h3>
                <p className="text-gray-600">{option.option_subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewCategory;
