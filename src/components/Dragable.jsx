import React from "react";
import { useDraggable } from "@dnd-kit/core";

const Dragable = ({ id, isGroupDragging }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isGroupDragging ? 0.6 : 1,
    transition: "all 0.15s ease",
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={`border-2 rounded bg-red-400 px-4 py-2 text-black text-center ${
        isDragging ? "ring-2 ring-yellow-400" : ""
      }`}
    >
      dragable {id}
    </div>
  );
};

export default Dragable;
