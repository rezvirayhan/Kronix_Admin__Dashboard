"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { ITestimonial } from "@/app/dashboard/testimonial/page";

const API_URL = "https://kronix-back-end-kappa.vercel.app/api/testimonials";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  testimonialId: string | null;
}

const ViewTestimonial: React.FC<Props> = ({
  isOpen,
  onClose,
  testimonialId,
}) => {
  const [testimonial, setTestimonial] = useState<ITestimonial | null>(null);

  useEffect(() => {
    if (!testimonialId) return;

    const fetchTestimonial = async () => {
      try {
        const res = await axios.get(`${API_URL}/${testimonialId}`);
        setTestimonial(res.data);
      } catch (error) {
        console.error("Error fetching testimonial:", error);
      }
    };
    fetchTestimonial();
  }, [testimonialId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#333333ec] flex items-center justify-center z-50 overflow-scroll">
      <div className="bg-[#e8ebf0] w-full md:w-2/5 rounded shadow-lg p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium">Testimonial</h2>
          <button type="button" onClick={onClose}>
            <IoCloseOutline className="text-xl cursor-pointer" />
          </button>
        </div>
        {testimonial ? (
          <div className="p-4 rounded-lg bg-white shadow-sm max-h-[500px] overflow-y-auto">
            <div className="flex gap-6">
              {testimonial.image && (
                <div>
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-40 h-40 object-cover rounded-lg shadow-sm"
                  />
                  <div>
                    <p className="text-center mt-2">{testimonial.name}</p>
                    <p className="text-center text-sm">{testimonial.title}</p>
                  </div>
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {testimonial.titleReview}
                </h3>
                <p className="my-1">{testimonial.reviewDescription}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default ViewTestimonial;
