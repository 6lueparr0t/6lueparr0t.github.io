import React from "react";

type ThumbProps = {
  selected: boolean;
  index: number;
  onClick: () => void;
  image: string;
};

export const Thumb: React.FC<ThumbProps> = ({ selected, index, onClick, image }) => {
  return (
    <div
      className={`w-14 h-14 m-1 border-2 rounded cursor-pointer flex items-center justify-center transition ${
        selected ? "border-blue-500 bg-blue-100" : "border-gray-300"
      }`}
    >
      <button onClick={onClick} type="button" className="w-full h-full">
        <img
          src={image}
          alt={`Thumbnail ${index + 1}`}
          className="object-cover w-full h-full rounded"
        />
      </button>
    </div>
  );
};
