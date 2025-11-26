"use client";
import React from "react";

interface HeaderCardProps {
  icon: React.ReactNode;
  title: string;
  buttonText?: string;
  buttonIcon?: React.ReactNode;
  onButtonClick?: () => void;
  className?: string;
}

const HeaderCard: React.FC<HeaderCardProps> = ({
  icon,
  title,
  buttonText,
  buttonIcon,
  onButtonClick,
  className = "",
}) => {
  return (
    <div className={`flex justify-between items-center mb-3 ${className}`}>
      <div className="flex gap-4 items-center">
        <div>{icon}</div>
        <div>
          <h1 className="text-2xl font-bold uppercase">{title}</h1>
        </div>
      </div>

      {buttonText && (
        <button
          onClick={onButtonClick}
          className="flex items-center gap-2 bg-[#00b0ea] text-white px-4 py-2 rounded hover:bg-[#0b6988] cursor-pointer"
        >
          {buttonIcon}
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default HeaderCard;
