"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";

const API_URL = "https://kronix-back-end-kappa.vercel.app/api/pricing";
interface Pricing {
  _id: string;
  pricingPackage: string;
  pricing: string;
  description: string;
  options: string[];
  price: number;
  priceTitle: string;
  createdAt: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  pricingId: string | null;
}

const ViewPricing: React.FC<Props> = ({ isOpen, onClose, pricingId }) => {
  const [pricing, setPricing] = useState<Pricing | null>(null);

  useEffect(() => {
    if (!pricingId) return;

    const fetchPricing = async () => {
      try {
        const res = await axios.get(`${API_URL}/${pricingId}`);
        setPricing(res.data);
      } catch (error) {
        console.error("Error fetching pricing:", error);
      }
    };
    fetchPricing();
  }, [pricingId]);

  if (!isOpen || !pricing) return null;

  return (
    <div className="fixed inset-0 bg-[#333333ec] flex items-center justify-center z-50 overflow-auto p-4">
      <div className="bg-[#e8ebf0] w-1/4 rounded shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-bold text-black">
            {pricing.pricingPackage}
          </h2>
          <button className="cursor-pointer" onClick={onClose}>
            <IoCloseOutline className="text-3xl text-black " />
          </button>
        </div>

        <p className="text-black text-lg mb-1">{pricing.description}</p>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-5xl font-bold text-black mt-5">
              $ {pricing.price}
            </p>
          </div>
        </div>
        <ul className="list-decimal list-inside space-y-3 mb-6 mt-10 text-black">
          {pricing.options.map((option, idx) => (
            <li key={idx} className="text-lg">
              {option}
            </li>
          ))}
        </ul>
        <div className="px-3 py-1 text-xs rounded-full border border-red-400 text-red-500 text-center transition mt-10">
          <p className="text-black text-lg">{pricing.priceTitle}</p>
        </div>
      </div>
    </div>
  );
};

export default ViewPricing;
