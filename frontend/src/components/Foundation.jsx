import { useDroppable } from "@dnd-kit/core";
import CardDraggable from "./CardDraggable";
import { useTheme } from "../context/ThemeContext";

const Foundation = ({ index, suit, foundation, hint }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `foundation-${suit}`,
    data: { destination: "foundation", destinationIdx: index },
  });
  const { theme } = useTheme();

  const topCard = foundation.peek();
  const isRed = suit === "♥" || suit === "♦";

  return (
    <div
      ref={setNodeRef}

      className={`relative w-12 sm:w-16 md:w-20 h-16 sm:h-24 md:h-28 rounded-md sm:rounded-lg border-[1px] sm:border-2 transition-all duration-200 ${
        isOver ? `${theme.foundationHover}` : `${theme.foundation}`
      } ${
        hint &&
        hint.destination === "foundation" &&
        hint.destinationIdx === index
          ? "bg-yellow-600 border-yellow-400 animate-pulse"
          : ""
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
            // Scaled the placeholder suit icon to fit mobile screens
            className={`text-3xl sm:text-4xl md:text-5xl opacity-30 ${
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

export default Foundation;