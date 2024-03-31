import React from "react";
import { ButtonProps } from "@/components/ui/buttons/ButtonProps";

const ButtonFill: React.FC<ButtonProps> = ({ children, styles }) => {
  return (
    <button
      className={`bg-primary py-2 px-6 text-white rounded-md text-sm flex items-center justify-center w-fit h-fit hover:bg-btnHover active:bg-btnActive ${styles}`}
    >
      {children}
    </button>
  );
};

export default ButtonFill;
