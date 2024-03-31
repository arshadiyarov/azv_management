import React from "react";
import { InfoBoxProps } from "@/components/ui/InfoBox/InfoBoxProps";

const InfoBox: React.FC<InfoBoxProps> = ({ title, body }) => {
  return (
    <div
      className={
        "bg-white p-5 rounded-lg w-[300px] lg:w-[360px] space-y-2 border border-border"
      }
    >
      <h4 className={"text-sm text-text font-medium"}>{title}</h4>
      <h3 className={"text-3xl font-medium"}>{body}</h3>
    </div>
  );
};

export default InfoBox;
