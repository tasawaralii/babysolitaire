import { useDroppable } from "@dnd-kit/core";
import Card from "./Card";
import { useDraggable } from "@dnd-kit/core";

export default function Stack({ cards, stackIndex }) {
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `stack-${stackIndex}`,
    data: { stackIndex },
  });

  return (
    <div
      ref={setDropRef}
      className={`w-32 h-64 border-2 border-white/50 rounded relative ${
        isOver ? "bg-green-600" : "bg-green-800"
      }`}
    >
      {cards.map((card, i) => (
        <DraggableCard
          key={card}
          value={card}
          stackIndex={stackIndex}
          cardIndex={i}
          offset={i * 30}
        />
      ))}
    </div>
  );
}

function DraggableCard({ value, stackIndex, cardIndex, offset }) {
  const { setNodeRef, listeners, attributes, transform, isDragging } =
    useDraggable({
      id: `${stackIndex}-${cardIndex}`,
      data: { stackIndex, cardIndex },
    });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    position: "absolute",
    top: `${offset}px`,
    zIndex: isDragging ? 999 : cardIndex,
  };

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={style}>
      <Card value={value} offset={0} />
    </div>
  );
}
