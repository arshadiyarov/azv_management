import React from "react";
import { ButtonProps } from "@/components/ui/buttons/ButtonProps";

const ButtonBorder: React.FC<ButtonProps> = ({ children }) => {
  return (
    <button
      className={`py-2 px-6 border border-gray-500 rounded-md text-sm flex items-center w-fit h-fit hover:bg-gray-50 active:bg-gray-100`}
    >
      {children}
    </button>
  );
};

export default ButtonBorder;
