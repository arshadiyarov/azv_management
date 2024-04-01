import React from "react";

const Loading = () => {
  return (
    <div
      className={
        "flex w-screen h-screen justify-center items-center bg-transparent"
      }
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
        width="200"
        height="200"
        style={{
          shapeRendering: "auto",
          display: "block",
          background: "rgb(243, 244, 246)",
        }}
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <g>
          <circle
            cx="50"
            cy="50"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="10"
            r="35"
            strokeDasharray="164.93361431346415 56.97787143782138"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              repeatCount="indefinite"
              dur="1s"
              values="0 50 50;360 50 50"
              keyTimes="0;1"
            ></animateTransform>
          </circle>
          <g></g>
        </g>
      </svg>
    </div>
  );
};

export default Loading;
