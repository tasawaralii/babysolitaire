import { useEffect, useRef, useState } from "react";
import Queue from "../dataStructures/Queue";
import CardView from "./CardView";

const SHOW_CARD_NUMBER = 3;

export default function Stock({ cards }) {
  const queueRef = useRef(new Queue());
  const [showCards, setShowCards] = useState([]);

  useEffect(() => {

    queueRef.current = new Queue();
    for (const card of cards) {
      queueRef.current.enqueue(card);
    }
    rotate();
  }, [cards]);

  function rotate() {
    const CardsQueue = queueRef.current;

    if (showCards.length > 0) {
      for (const card of showCards) {
        CardsQueue.enqueue(card);
      }
    }

    const current = [];
    for (let i = 0; i < SHOW_CARD_NUMBER; i++) {
      const card = CardsQueue.dequeue();
      if (!card) break;
      card.faceUp = true;
      current.push(card);
    }

    setShowCards(current);
  }

  return (
    <div className="flex gap-5">
      <div className="w-20 h-28 bg-green-900 border-2 border-white rounded-lg flex items-center justify-center">
        <span className="text-sm">Stock ({queueRef.current.items.length})</span>
      </div>

      <div className="flex gap-2">
        {showCards.map((card, i) => (
          <CardView key={i} card={card} />
        ))}
      </div>

      <button
        className="border p-2 h-10 rounded bg-yellow-600 cursor-pointer"
        onClick={rotate}
      >
        Shift
      </button>
    </div>
  );
}
