"use client";

import { IoCloseOutline } from "react-icons/io5";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  heading: string;
  message: string;
  yesText?: string;
  noText?: string;
}

const DeleteingModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  heading,
  message,
  yesText = "Yes",
  noText = "No",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#333333ec]  flex items-center justify-center z-[9999]">
      <div className="bg-[#e8ebf0]  rounded-xl shadow-lg w-[425px] p-5">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">{heading}</h2>
          <button onClick={onClose}>
            <IoCloseOutline className="text-2xl cursor-pointer text-gray-700 hover:text-black" />
          </button>
        </div>

        <p className="mt-5 text-gray-600">{message}</p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 bg-red-500 cursor-pointer rounded text-white text-sm"
            onClick={onConfirm}
          >
            {yesText}
          </button>
          <button
            className="px-4 py-2 bg-[#16A34A] cursor-pointer rounded text-white text-sm "
            onClick={onClose}
          >
            {noText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteingModal;
