"use client";
import React from "react";
import { FaSearch } from "react-icons/fa";

interface Props {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

const ReusableSearch: React.FC<Props> = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}) => {
  const handleClear = () => {
    onChange("");
  };

  return (
    <div className="bg-[#d1d5db] w-full p-4">
      <div
        className={`flex items-center gap-2 justify-end w-full ${className}`}
      >
        <div className="relative w-1/4">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-white text-black p-2 pl-10 rounded-l border-none"
          />
        </div>

        <button
          onClick={handleClear}
          className="bg-[#00b0ea] text-white px-4 py-2 rounded-r hover:bg-[#0b6988] transition cursor-pointer"
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

export default ReusableSearch;
