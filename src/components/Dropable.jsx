import React from "react";
import { useDroppable } from "@dnd-kit/core";

const Dropable = ({ okay, count }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: "dropable",
  });
  const style = {
    color: isOver ? "green" : undefined,
  };
  return (
    <div
      ref={setNodeRef}
      className={`w-64 h-32 flex items-center justify-center border-4 rounded-lg transition-all duration-300 ${
        isOver
          ? "border-yellow-400 bg-yellow-200 text-black"
          : okay
          ? "border-white bg-green-500"
          : "border-gray-300 bg-green-800"
      }`}
    >
      dropable {count}
    </div>
  );
};

export default Dropable;
