import CardView from "./CardView";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";

const DraggableCard = ({ id, data, card }) => {
  const { listeners, setNodeRef, attributes, transform, isDragging } =
    useDraggable({ id, data });
  const transformCss = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };
  return (
    <div ref={setNodeRef} style={transformCss} {...listeners} {...attributes}>
      <CardView card={card} />
    </div>
  );
};

export default function Pile({ index, cards }) {

  const {setNodeRef, isOver} = useDroppable({id:`pile-${index}`, data:{index}})
  return (
    <div
      ref={setNodeRef}
      className={`w-20 ${
        isOver ? "bg-yellow-900" : "bg-green-900"
      } border-2 border-white rounded-lg flex flex-col items-center pt-1 pb-2`}
    >
      <span className="text-xs mb-1">Pile {index}</span>
        <div className="flex flex-col space-y-1">
          {cards.map((card, i) =>
            card.faceUp ? (
              <DraggableCard
                key={i}
                id={`${card.suit}-${card.rank}`}
                data={{ pile: index, card: i }}
                card={card}
              />
            ) : (
              <CardView card={card} key={i} />
            )
          )}
        </div>
    </div>
  );
}
