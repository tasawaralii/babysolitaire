import { useDraggable } from "@dnd-kit/core";
import Card from "./Card";
const CardDraggable = ({ card, cardSource, sourceIdx, cardIdx, isHinted }) => {
  if (!card) return null;
  const { setNodeRef, attributes, listeners, transform, isDragging } =
    useDraggable({
      id: `card-${card.id}`,
      data: { cardSource, sourceIdx, cardIdx, card },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50,
        touchAction: "none",
      }
    : {
        touchAction: "none",
      };;

  return (
    <div
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`${isDragging ? "opacity-50" : ""} ${
        isHinted ? "rounded ring-4 ring-yellow-400 animate-pulse" : ""
      }
        `}
    >
      <Card card={card} isDraggable={true} />
    </div>
  );
};

export default CardDraggable;
