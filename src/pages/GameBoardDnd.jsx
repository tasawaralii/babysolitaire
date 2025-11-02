import React, { useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragOverlay,
} from "@dnd-kit/core";
import GameState from "../game/GameState";

// 🎴 Card Component
const Card = ({ card, pileId }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `${pileId}-${card.code}`,
      data: { pileId, card },
    });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    opacity: isDragging ? 0.4 : 1,
    backgroundColor: "white",
    border: "1px solid black",
    borderRadius: "6px",
    width: "80px",
    height: "120px",
    cursor: "grab",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
  };

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={style}>
      {card.faceUp ? `${card.rank}${card.suit}` : "🂠"}
    </div>
  );
};

// 🪣 Pile Component
const Pile = ({ id, cards }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        width: "80px",
        minHeight: "120px",
        margin: "0 10px",
        border: isOver ? "2px solid yellow" : "1px solid gray",
        borderRadius: "8px",
        padding: "5px",
        backgroundColor: "#0f5132",
        // position: "relative",
      }}
    >
      {cards.map((card, index) => (
        <div
        className=""
          key={card.code}
          style={{
            position: "absolute",
            top: `${index * 25}px`,
            zIndex: index,
          }}
        >
          <Card card={card} pileId={id} />
        </div>
      ))}
    </div>
  );
};

// 🧠 GameBoard (main)
export default function GameBoardDnd() {
  const [gameState, setGameState] = useState(new GameState([]));
  const [activeStack, setActiveStack] = useState(null);

  // mock data for now
  const [piles, setPiles] = useState({
    pile1: [
      { code: "A♠", rank: "A", suit: "♠", faceUp: true },
      { code: "2♠", rank: "2", suit: "♠", faceUp: true },
      { code: "3♠", rank: "3", suit: "♠", faceUp: true },
    ],
    pile2: [
      { code: "K♥", rank: "K", suit: "♥", faceUp: true },
      { code: "Q♥", rank: "Q", suit: "♥", faceUp: true },
    ],
    pile3: [],
  });

  // 🟢 Drag Start — capture stack
  const handleDragStart = (event) => {
    console.log(event)
    const { card, pileId } = event.active.data.current;
    const sourcePile = piles[pileId];
    const index = sourcePile.findIndex((c) => c.code === card.code);
    const draggedStack = sourcePile.slice(index); // all cards above (including)
    setActiveStack({ from: pileId, cards: draggedStack });
  };

  // 🔵 Drag End — move stack
  const handleDragEnd = (event) => {
    const { over } = event;
    console.log(over)
    if (!over || !activeStack) {
      setActiveStack(null);
      return;
    }

    const fromPile = activeStack.from;
    const toPile = over.id;

    if (toPile && fromPile && toPile !== fromPile) {
      setPiles((prev) => {
        const newPiles = { ...prev };
        // remove dragged stack from source
        newPiles[fromPile] = newPiles[fromPile].slice(
          0,
          newPiles[fromPile].length - activeStack.cards.length
        );
        // add stack to target
        newPiles[toPile] = [...newPiles[toPile], ...activeStack.cards];
        return newPiles;
      });
    }

    setActiveStack(null);
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
      >
        {Object.entries(piles).map(([id, cards]) => (
          <Pile key={id} id={id} cards={cards} />
        ))}
      </div>

      {/* 🪄 Overlay for dragging multiple cards */}
      <DragOverlay>
        {activeStack ? (
          <div style={{ position: "relative" }}>
            {activeStack.cards.map((card, i) => (
              <div
                key={card.code}
                style={{ position: "absolute", top: `${i * 25}px` }}
              >
                <Card card={card} pileId={activeStack.from} />
              </div>
            ))}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
