"use client";

import React, { useState } from "react";

interface InputFieldProps {
  label?: string;
  id?: string;
  name?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  labelColor?: string;
  textColor?: string;
  placeholderColor?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  name,
  type = "text",
  placeholder = "",
  value,
  onChange,
  required = false,
  disabled = false,
  className = "",
  labelColor = "text-gray-700",
  textColor = "text-gray-900",
  placeholderColor = "placeholder-gray-400",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div className="flex flex-col w-full relative">
      {label && (
        <label
          htmlFor={id}
          className={`text-sm font-medium mb-1 ${labelColor}`}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          id={id}
          name={name}
          type={isPassword && showPassword ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          autoComplete="off"
          className={`flex h-11 w-full rounded-md border border-black bg-white px-3 py-2 text-sm 
          ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium 
          focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black focus-visible:ring-offset-0 
          disabled:cursor-not-allowed disabled:opacity-50 mt-1 shadow-inner transition-all
          ${textColor} ${placeholderColor} ${className}`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <span>Hide </span> : <span>Show </span>}
          </button>
        )}
      </div>
    </div>
  );
};

export default InputField;
