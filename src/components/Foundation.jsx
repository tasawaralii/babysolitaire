import { useDroppable } from "@dnd-kit/core";
import CardDraggable from "./CardDraggable";

const Foundation = ({ index, suit, foundation, hint }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `foundation-${suit}`,
    data: { destination: "foundation", destinationIdx: index },
  });

  const topCard = foundation.peek();
  const isRed = suit === "♥" || suit === "♦";

  return (
    <div
      ref={setNodeRef}
      className={`relative w-20 h-28 rounded-lg border-2 transition-all duration-200 ${
        isOver
          ? "bg-green-600 border-green-400"
          : hint &&
            hint.destination === "foundation" &&
            hint.destinationIdx === index
          ? "bg-yellow-600 border-yellow-400 animate-pulse"
          : "bg-green-800 border-green-700"
      }`}
    >
      {topCard ? (
        <CardDraggable
          card={topCard}
          cardSource="foundation"
          sourceIdx={index}
          cardIdx={foundation.size() - 1}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div
            className={`text-5xl opacity-30 ${
              isRed ? "text-red-300" : "text-gray-700"
            }`}
          >
            {suit}
          </div>
        </div>
      )}
    </div>
  );
};

export default Foundation