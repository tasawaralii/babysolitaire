import { useDraggable } from "@dnd-kit/core";
import Card from "./Card";
const CardDraggable = ({ card, cardSource, sourceIdx, cardIdx }) => {
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
      }
    : undefined;

  return (
    <div
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`${
        isDragging ? "opacity-50" : ""
      } hover:-translate-y-1 transition-transform`}
    >
      <Card card={card} />
    </div>
  );
};

export default CardDraggable