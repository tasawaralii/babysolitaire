import React, { useState, useEffect } from "react";

// Data Structure: Stack
class Stack {
  constructor() {
    this.items = [];
  }

  push(item) {
    this.items.push(item);
  }

  pop() {
    return this.items.pop();
  }

  peek() {
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }

  getAll() {
    return [...this.items];
  }
}

// Data Structure: Queue
class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(item) {
    this.items.push(item);
  }

  dequeue() {
    return this.items.shift();
  }

  front() {
    return this.items[0];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }
}

// Data Structure: Linked List Node
class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

// Data Structure: Linked List
class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }

  add(data) {
    const node = new Node(data);
    if (!this.head) {
      this.head = node;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = node;
    }
    this.size++;
  }

  removeFrom(index) {
    if (index < 0 || index >= this.size) return null;

    if (index === 0) {
      const removed = this.head;
      this.head = null;
      this.size = 0;
      return removed;
    }

    let current = this.head;
    let prev = null;
    let count = 0;

    while (count < index) {
      prev = current;
      current = current.next;
      count++;
    }

    prev.next = null;
    this.size = index;
    return current;
  }

  

  toArray() {
    const arr = [];
    let current = this.head;
    while (current) {
      arr.push(current.data);
      current = current.next;
    }
    return arr;
  }

  getLast() {
    if (!this.head) return null;
    let current = this.head;
    while (current.next) {
      current = current.next;
    }
    return current.data;
  }
}

// Card suits and values
const SUITS = ["♠", "♥", "♦", "♣"];
const VALUES = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];

// Validation Functions (Placeholders - return true)
const isValidTableauMove = (draggedCards, targetPile) => {
  // TODO: Add validation logic
  return true;
};

const isValidFoundationMove = (card, foundationStack) => {
  // TODO: Add validation logic
  return true;
};

export default function Solitaire() {
  const [deck, setDeck] = useState(new Stack());
  const [waste, setWaste] = useState(new Stack());
  const [foundations, setFoundations] = useState([
    new Stack(),
    new Stack(),
    new Stack(),
    new Stack(),
  ]);
  const [tableau, setTableau] = useState([
    new LinkedList(),
    new LinkedList(),
    new LinkedList(),
    new LinkedList(),
    new LinkedList(),
    new LinkedList(),
    new LinkedList(),
  ]);
  const [draggedData, setDraggedData] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

  // Initialize deck
  const initializeDeck = () => {
    const newDeck = new Stack();
    const cards = [];

    SUITS.forEach((suit) => {
      VALUES.forEach((value) => {
        cards.push({
          suit,
          value,
          faceUp: false,
          id: `${suit}-${value}-${Math.random()}`,
        });
      });
    });

    // Shuffle
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    cards.forEach((card) => newDeck.push(card));
    return newDeck;
  };

  // Deal cards to tableau
  const dealCards = () => {
    const newDeck = initializeDeck();
    const newTableau = [
      new LinkedList(),
      new LinkedList(),
      new LinkedList(),
      new LinkedList(),
      new LinkedList(),
      new LinkedList(),
      new LinkedList(),
    ];

    for (let i = 0; i < 7; i++) {
      for (let j = i; j < 7; j++) {
        const card = newDeck.pop();
        card.faceUp = i === j;
        newTableau[j].add(card);
      }
    }

    setDeck(newDeck);
    setTableau(newTableau);
    setWaste(new Stack());
    setFoundations([new Stack(), new Stack(), new Stack(), new Stack()]);
    setGameStarted(true);
  };

  // Draw from deck
  const drawCard = () => {
    if (!deck.isEmpty()) {
      const card = deck.pop();
      card.faceUp = true;
      const newWaste = new Stack();
      waste.getAll().forEach((c) => newWaste.push(c));
      newWaste.push(card);
      setWaste(newWaste);
      setDeck(new Stack());
      deck.getAll().forEach((c) => deck.push(c));
    } else if (!waste.isEmpty()) {
      const newDeck = new Stack();
      const wasteCards = waste.getAll();
      for (let i = wasteCards.length - 1; i >= 0; i--) {
        wasteCards[i].faceUp = false;
        newDeck.push(wasteCards[i]);
      }
      setDeck(newDeck);
      setWaste(new Stack());
    }
  };

  // Handle drag start
  const handleDragStart = (e, card, source, sourceIndex, cardIndex) => {
    if (!card.faceUp) return;

    let cards = [];

    if (source === "tableau") {
      const pileCards = tableau[sourceIndex].toArray();
      cards = pileCards.slice(cardIndex);
    } else {
      cards = [card];
    }

    setDraggedData({ cards, source, sourceIndex, cardIndex });
    e.dataTransfer.effectAllowed = "move";
  };

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  // Handle drop on tableau
  const handleDropTableau = (e, targetIndex) => {
    e.preventDefault();
    if (!draggedData) return;

    const { cards, source, sourceIndex } = draggedData;

    if (isValidTableauMove(cards, tableau[targetIndex])) {
      // Remove from source
      if (source === "tableau") {
        const newTableau = [...tableau];
        newTableau[sourceIndex].removeFrom(draggedData.cardIndex);

        // Flip last card if exists
        const lastCard = newTableau[sourceIndex].getLast();
        if (lastCard && !lastCard.faceUp) {
          lastCard.faceUp = true;
        }

        // Add to target
        cards.forEach((card) => newTableau[targetIndex].add(card));
        setTableau(newTableau);
      } else if (source === "waste") {
        const newWaste = new Stack();
        waste
          .getAll()
          .slice(0, -1)
          .forEach((c) => newWaste.push(c));
        setWaste(newWaste);

        const newTableau = [...tableau];
        cards.forEach((card) => newTableau[targetIndex].add(card));
        setTableau(newTableau);
      } else if (source === "foundation") {
        const newFoundations = [...foundations];
        newFoundations[sourceIndex].pop();
        setFoundations(newFoundations);

        const newTableau = [...tableau];
        cards.forEach((card) => newTableau[targetIndex].add(card));
        setTableau(newTableau);
      }
    }

    setDraggedData(null);
  };

  // Handle drop on foundation
  const handleDropFoundation = (e, targetIndex) => {
    e.preventDefault();
    if (!draggedData) return;

    const { cards, source, sourceIndex } = draggedData;

    if (cards.length !== 1) return; // Only single cards to foundation

    const card = cards[0];

    if (isValidFoundationMove(card, foundations[targetIndex])) {
      const newFoundations = [...foundations];
      newFoundations[targetIndex].push(card);

      if (source === "tableau") {
        const newTableau = [...tableau];
        newTableau[sourceIndex].removeFrom(draggedData.cardIndex);

        // Flip last card if exists
        const lastCard = newTableau[sourceIndex].getLast();
        if (lastCard && !lastCard.faceUp) {
          lastCard.faceUp = true;
        }

        setTableau(newTableau);
      } else if (source === "waste") {
        const newWaste = new Stack();
        waste
          .getAll()
          .slice(0, -1)
          .forEach((c) => newWaste.push(c));
        setWaste(newWaste);
      } else if (source === "foundation") {
        const newSourceFoundations = [...foundations];
        newSourceFoundations[sourceIndex].pop();
        setFoundations(newSourceFoundations);
      }

      setFoundations(newFoundations);
    }

    setDraggedData(null);
  };

  const Card = ({ card, onDragStart, style = {} }) => {
    const isRed = card.suit === "♥" || card.suit === "♦";

    return (
      <div
        draggable={card.faceUp}
        onDragStart={onDragStart}
        style={style}
        className={`w-16 h-24 rounded border-2 flex flex-col items-center justify-center transition-transform hover:scale-105 ${
          card.faceUp
            ? "bg-white border-gray-800 cursor-move"
            : "bg-blue-600 border-blue-800 cursor-default"
        }`}
      >
        {card.faceUp ? (
          <>
            <span
              className={`text-2xl font-bold ${
                isRed ? "text-red-600" : "text-black"
              }`}
            >
              {card.value}
            </span>
            <span
              className={`text-2xl ${isRed ? "text-red-600" : "text-black"}`}
            >
              {card.suit}
            </span>
          </>
        ) : (
          <span className="text-white text-xl">🂠</span>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-green-800 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Solitaire
        </h1>

        {!gameStarted ? (
          <div className="flex justify-center">
            <button
              onClick={dealCards}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-xl"
            >
              Start New Game
            </button>
          </div>
        ) : (
          <div>
            {/* Top Row: Deck, Waste, and Foundations */}
            <div className="flex justify-between mb-8">
              <div className="flex gap-4">
                {/* Deck */}
                <div onClick={drawCard} className="cursor-pointer">
                  {!deck.isEmpty() ? (
                    <div className="w-16 h-24 bg-blue-600 border-2 border-blue-800 rounded flex items-center justify-center hover:bg-blue-700">
                      <span className="text-white text-xl">🂠</span>
                    </div>
                  ) : (
                    <div className="w-16 h-24 border-2 border-dashed border-gray-400 rounded hover:border-gray-300"></div>
                  )}
                </div>

                {/* Waste */}
                <div>
                  {!waste.isEmpty() ? (
                    <Card
                      card={waste.peek()}
                      onDragStart={(e) =>
                        handleDragStart(e, waste.peek(), "waste", 0, 0)
                      }
                    />
                  ) : (
                    <div className="w-16 h-24 border-2 border-dashed border-gray-400 rounded"></div>
                  )}
                </div>
              </div>

              {/* Foundations */}
              <div className="flex gap-4">
                {foundations.map((foundation, i) => (
                  <div
                    key={i}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropFoundation(e, i)}
                    className="relative"
                  >
                    {!foundation.isEmpty() ? (
                      <Card
                        card={foundation.peek()}
                        onDragStart={(e) =>
                          handleDragStart(
                            e,
                            foundation.peek(),
                            "foundation",
                            i,
                            0
                          )
                        }
                      />
                    ) : (
                      <div className="w-16 h-24 border-2 border-dashed border-gray-400 rounded"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Tableau */}
            <div className="flex gap-4 justify-center">
              {tableau.map((pile, i) => (
                <div
                  key={i}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDropTableau(e, i)}
                  className="relative min-h-32"
                >
                  {pile.toArray().length === 0 ? (
                    <div className="w-16 h-24 border-2 border-dashed border-gray-400 rounded"></div>
                  ) : (
                    <div className="relative">
                      {pile.toArray().map((card, j) => (
                        <div
                          key={card.id}
                          style={{
                            position: j > 0 ? "absolute" : "relative",
                            top: j > 0 ? `${j * 30}px` : "0",
                            left: 0,
                            zIndex: j,
                          }}
                        >
                          <Card
                            card={card}
                            onDragStart={(e) =>
                              handleDragStart(e, card, "tableau", i, j)
                            }
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-38 flex justify-center gap-4">
              <button
                onClick={dealCards}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                New Game
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
