import { useEffect, useRef, useState } from "react";
import Queue from "../dataStructures/Queue";
import CardView from "./CardView";

const SHOW_CARD_NUMBER = 3;

export default function Stock({ cards }) {
  const queueRef = useRef(new Queue());
  const [showCards, setShowCards] = useState([]);
  const [queueSize, setQueueSize] = useState(0); // track queue size for display

  // Initialize the queue whenever cards change
  useEffect(() => {
    const q = new Queue();
    for (const card of cards) {
      q.enqueue({ ...card, faceUp: false }); // clone card object for immutability
    }
    queueRef.current = q;
    setQueueSize(q.size());
    setShowCards([]);
  }, [cards]);

  function rotate() {
    const q = queueRef.current;

    // Put previously shown cards back to the queue (face down)
    for (const card of showCards) {
      q.enqueue({ ...card, faceUp: false });
    }

    // Draw new cards
    const newShow = [];
    for (let i = 0; i < SHOW_CARD_NUMBER; i++) {
      const card = q.dequeue();
      if (!card) break;
      newShow.push({ ...card, faceUp: true });
    }

    setShowCards(newShow);
    setQueueSize(q.size());
  }

  return (
    <div className="flex gap-5 items-center">
      {/* Stock pile display */}
      <div className="w-20 h-28 bg-green-900 border-2 border-white rounded-lg flex items-center justify-center">
        <span className="text-sm">Stock ({queueSize})</span>
      </div>

      {/* Currently shown cards */}
      <div className="flex gap-2">
        {showCards.map((card, i) => (
          <CardView key={`${card.suit}-${card.rank}-${i}`} card={card} />
        ))}
      </div>

      {/* Rotate button */}
      <button
        className="border p-2 h-10 rounded bg-yellow-600 cursor-pointer"
        onClick={rotate}
      >
        Shift
      </button>
    </div>
  );
}
