import React, { useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragOverlay,
} from "@dnd-kit/core";

const initialColumns = {
  col1: [
    { id: "A", label: "A", faceUp: true },
    { id: "B", label: "B", faceUp: true },
    { id: "C", label: "C", faceUp: true }, // top
  ],
  col2: [],
};

export default function SolitaireDemo() {
  const [columns, setColumns] = useState(initialColumns);
  const [draggedCards, setDraggedCards] = useState([]);

  // Helper: find which column a card belongs to
  const findCardLocation = (cardId) => {
    for (const [colId, cards] of Object.entries(columns)) {
      const index = cards.findIndex((c) => c.id === cardId);
      if (index !== -1) return { colId, index };
    }
    return null;
  };

  function handleDragStart(event) {
    const { active } = event;
    const loc = findCardLocation(active.id);
    if (!loc) return;

    const col = columns[loc.colId];
    const cardsToDrag = col.slice(loc.index).filter((c) => c.faceUp);

    setDraggedCards(cardsToDrag);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return setDraggedCards([]);

    const source = findCardLocation(active.id);
    if (!source) return setDraggedCards([]);

    const destColId = over.id;
    const cardsToMove = draggedCards;

    // Remove from source
    const newSource = [...columns[source.colId]].slice(0, source.index);

    // Add to destination
    const newDest = [...columns[destColId], ...cardsToMove];

    setColumns({
      ...columns,
      [source.colId]: newSource,
      [destColId]: newDest,
    });

    setDraggedCards([]);
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div style={{ display: "flex", gap: 40 }}>
        {Object.entries(columns).map(([colId, cards]) => (
          <Column key={colId} id={colId} cards={cards} />
        ))}
      </div>

      <DragOverlay>
        {draggedCards.length > 0 && (
          <div style={{ position: "relative" }}>
            {draggedCards.map((card, i) => (
              <Card
                key={card.id}
                card={card}
                style={{
                  position: "absolute",
                  top: i * 20, // stacked offset
                }}
              />
            ))}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

// 🧱 Droppable Column
function Column({ id, cards }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        width: 100,
        height: 400,
        border: "2px dashed gray",
        position: "relative",
      }}
    >
      {cards.map((card, i) => (
        <DraggableCard key={card.id} card={card} index={i} />
      ))}
    </div>
  );
}

// 🂠 Draggable Card
function DraggableCard({ card, index }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: card.id,
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    position: "absolute",
    top: index * 30,
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      <Card card={card} style={style} />
    </div>
  );
}

// 🃏 Simple Card Component
function Card({ card, style }) {
  return (
    <div
      style={{
        width: 80,
        height: 100,
        backgroundColor: card.faceUp ? "white" : "gray",
        border: "1px solid black",
        borderRadius: 8,
        textAlign: "center",
        lineHeight: "100px",
        position: "relative",
        ...style,
      }}
    >
      {card.faceUp ? card.label : ""}
    </div>
  );
}