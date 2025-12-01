"use client";
import React from "react";

interface SortOption {
  value: string;
  label: string;
}

interface Props {
  sortField: string;
  onSortFieldChange: (val: string) => void;
  sortOptions: SortOption[];
  sortOrder: "asc" | "desc";
  onSortOrderChange: (val: "asc" | "desc") => void;
  className?: string;
}

const ReusableSort: React.FC<Props> = ({
  sortField,
  onSortFieldChange,
  sortOptions,
  sortOrder,
  onSortOrderChange,
  className = "",
}) => {
  const handleClick = (value: string) => {
    if (sortField === value) {
      onSortOrderChange(sortOrder === "asc" ? "desc" : "asc");
    } else {
      onSortFieldChange(value);
      onSortOrderChange("desc");
    }
  };

  return (
    <div className={`flex gap-2 ${className} flex-wrap`}>
      {sortOptions.map((opt) => (
        <button
          key={opt.value}
          onClick={() => handleClick(opt.value)}
          className={` cursor-pointer ${sortField === opt.value ? "" : ""}`}
        >
          {sortField === opt.value ? (sortOrder === "asc" ? "↑" : "↓") : "⇵"}
        </button>
      ))}
    </div>
  );
};

export default ReusableSort;
