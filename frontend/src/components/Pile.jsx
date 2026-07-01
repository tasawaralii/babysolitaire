import { useDroppable } from "@dnd-kit/core";
import CardDraggable from "./CardDraggable";
import Card from "./Card";
import { useTheme } from "../context/ThemeContext";

const Pile = ({ pile, pileIdx, hint }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `pile-${pileIdx}`,
    data: { destination: "pile", destinationIdx: pileIdx },
  });
  const { theme } = useTheme();

  const cards = pile.toArray();
  const hasCards = cards.length > 0;

  const pileHeight = cards.length * 28 + 96;

  return (
    <div
      ref={setNodeRef}
      className={`relative w-20 transition-colors duration-200 ${isOver ? "" : ""
        }`}
      style={{ height: pileHeight }}
    >
      {/* Empty pile placeholder */}
      {!hasCards && (
        <div className={`w-20 h-28 rounded-lg border-2 border-dashed ${theme.emptyPileBorder} opacity-40`} />
      )}

      {/* Cards stack */}
      <div className="absolute top-0 left-0">
        {cards.map((card, j) => (
          <div
            key={j}
            style={{
              position: "absolute",
              top: `${j * 28}px`,
              left: 0,
            }}
          >
            {card.faceUp ? (
              <CardDraggable
                cardSource="pile"
                card={card}
                cardIdx={j}
                sourceIdx={pileIdx}
                isHinted={
                  hint &&
                  ((hint.source === "pile" &&
                    hint.sourceIdx === pileIdx &&
                    hint.cardIdx === j) ||
                    (hint.destination === "pile" &&
                      hint.destinationIdx === pileIdx &&
                      j === cards.length - 1))
                }
              />
            ) : (
              <Card card={card} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pile;
