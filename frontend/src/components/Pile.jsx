import { useDroppable } from "@dnd-kit/core";
import CardDraggable from "./CardDraggable";
import Card from "./Card";
import { useTheme } from "../context/ThemeContext";
import { useState, useEffect } from "react";

const Pile = ({ pile, pileIdx, hint }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `pile-${pileIdx}`,
    data: { destination: "pile", destinationIdx: pileIdx },
  });
  
  const { theme } = useTheme();
  
  // Track window width to adjust overlapping math
  const [overlap, setOverlap] = useState(28);

  useEffect(() => {
    const handleResize = () => {
      // 14px overlap on mobile, 28px on desktop
      setOverlap(window.innerWidth < 640 ? 14 : 28); 
    };
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cards = pile.toArray();
  const hasCards = cards.length > 0;
  
  // Dynamic height base on mobile vs desktop card height
  const baseHeight = overlap === 14 ? 64 : 112; 
  const pileHeight = cards.length * overlap + baseHeight;

  return (
    <div
      ref={setNodeRef}
      // Match the w-12 sm:w-16 md:w-20 from the Card component
      className={`relative w-12 sm:w-16 md:w-20 transition-colors duration-200`}
      style={{ height: pileHeight }}
    >
      {!hasCards && (
        <div className={`w-12 sm:w-16 md:w-20 h-16 sm:h-24 md:h-28 rounded-md sm:rounded-lg border-2 border-dashed ${theme.emptyPileBorder} opacity-40`} />
      )}
      
      <div className="absolute top-0 left-0">
        {cards.map((card, j) => (
          <div
            key={j}
            style={{
              position: "absolute",
              top: `${j * overlap}px`,
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