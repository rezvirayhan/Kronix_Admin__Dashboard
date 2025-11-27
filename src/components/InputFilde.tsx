"use client";

import React, { useState } from "react";

interface InputFieldProps {
  label?: string;
  id?: string;
  name?: string;
  type?: string;
  as?: "input" | "textarea"; // support textarea
  placeholder?: string;
  value?: string | File | null;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
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
  as = "input",
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

  const baseClasses = `flex w-full rounded-md border border-gray-300 bg-[#ebeff4] px-3 py-2 text-sm 
    placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500
    focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 mt-1
    shadow-[inset_1px_1px_2px_#aaa,inset_-1px_-1px_2px_#fff]
    ${textColor} ${placeholderColor} ${className}`;

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
        {as === "textarea" ? (
          <textarea
            id={id}
            name={name}
            placeholder={placeholder}
            value={value as string | undefined}
            onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
            required={required}
            disabled={disabled}
            className={`${baseClasses} h-24 resize-none`}
          />
        ) : (
          <input
            id={id}
            name={name}
            type={isPassword && showPassword ? "text" : type}
            placeholder={placeholder}
            value={value as string | undefined}
            onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
            required={required}
            disabled={disabled}
            autoComplete="off"
            className={`${baseClasses} ${
              type === "file" ? "h-auto py-1" : "h-10"
            }`}
          />
        )}

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-3 flex items-center text-black text-sm hover:text-gray-700"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        )}
      </div>
    </div>
  );
};

export default InputField;
