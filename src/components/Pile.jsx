import { useDroppable } from "@dnd-kit/core";
import CardDraggable from "./CardDraggable"; 
import Card from "./Card";

const Pile = ({ pile, pileIdx }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `pile-${pileIdx}`,
    data: { destination: "pile", destinationIdx: pileIdx },
  });

  const cards = pile.toArray();
  const hasCards = cards.length > 0;

  const pileHeight = (cards.length * 28) + 96;

  return (
    <div
      ref={setNodeRef}
      className={`relative w-20 transition-colors duration-200 ${
        isOver ? "" : ""
      }`}
      style={{ height: pileHeight }}
    >
      {/* Empty pile placeholder */}
      {!hasCards && (
        <div className="w-20 h-28 rounded-lg border-2 border-dashed border-green-600 opacity-40" />
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