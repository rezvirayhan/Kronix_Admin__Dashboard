"use client";
import React from "react";
import { GrNext, GrPrevious } from "react-icons/gr";

interface Props {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  limits?: number[];
}

const DynamicPagination: React.FC<Props> = ({
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
  limits = [2, 5, 10, 20, 30],
}) => {
  const totalPages = Math.ceil(total / limit);

  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    if (page <= 4) return [1, 2, 3, 4, 5, "...", totalPages];
    if (page >= totalPages - 3)
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  return (
    <div className="flex justify-between items-center  gap-2 mt-6">
      <select
        value={limit}
        onChange={(e) => onLimitChange(Number(e.target.value))}
        className="border  rounded h-8 p-1 text-xl"
      >
        {limits.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>

      <div className="flex items-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="flex items-center justify-center"
        >
          <GrPrevious className="text-4xl font-bold p-2 bg-[#D1D5DB] text-[#02a6dd] border rounded-full" />
        </button>
        {generatePageNumbers().map((p, i) =>
          p === "..." ? (
            <span
              key={i}
              className="flex items-center justify-center px-3 py-2 text-gray-500 font-bold"
            >
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(Number(p))}
              className={`flex items-center justify-center font-bold p-1 px-3 border rounded-full ${
                page === p
                  ? "bg-[#02a6dd] text-white"
                  : "text-[#02a6dd] bg-white"
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => onPageChange(page + 1)}
          className="flex items-center justify-center"
        >
          <GrNext className="text-4xl bg-[#D1D5DB] text-[#02a6dd] font-bold p-2  border rounded-full" />
        </button>
      </div>
    </div>
  );
};

export default DynamicPagination;
