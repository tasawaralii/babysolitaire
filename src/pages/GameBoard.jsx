import React, { useEffect, useState } from "react";

import Controls from "../components/Controls";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import LinkedList from "../dataStructures/LinkedList";
import Stack from "../dataStructures/Stack";
import Queue from "../dataStructures/Queue";

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

const Card = ({ card }) => {
  return (
    <div
      className={`w-16 h-8 rounded-md border ${
        card.faceUp ? "cursor-pointer" : ""
      } text-center text-sm ${
        card.faceUp
          ? `bg-white text-${card.color == "red" ? "red-400" : "black"}`
          : "bg-blue-900 text-blue-900"
      }`}
    >
      {card.faceUp ? `${card.value}${card.suit}` : ""}
    </div>
  );
};
const Pile = ({pile, pileIdx}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `pile-${pileIdx}`,
    data: { type: "pile", index: pileIdx },
  });

  return (
    <div
      ref={setNodeRef}
      className={`w-20 ${
        isOver ? "bg-yellow-900" : "bg-green-900"
      } border-2 border-white rounded-lg flex flex-col items-center pt-1 pb-2`}
    >
      <span className="text-xs mb-1">Pile {pileIdx}</span>
      <div className="flex flex-col space-y-1">
        {pile.toArray().map((card, j) => (
          card.faceUp ? 
          <CardDraggable key={j} card={card} cardIdx={j} pileIndex={pileIdx} />
          : <Card key={j} card={card} />
        ))}
      </div>
    </div>
  );
}

const CardDraggable = ({card, pileIndex, cardIdx}) => {
  const { setNodeRef, attributes, listeners, transform } = useDraggable({
    id: `card-${card.id}`,
    data: { source: "pile", index: pileIndex, cardIdx },
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px,0)`,
      }
    : undefined;
  return (
    <div style={style} ref={setNodeRef} {...attributes} {...listeners}>
      <Card card={card} />
    </div>
  );
}

const GameBoard = () => {
  const [tableaus, setTableaus] = useState([
    new LinkedList(),
    new LinkedList(),
    new LinkedList(),
    new LinkedList(),
    new LinkedList(),
    new LinkedList(),
    new LinkedList(),
  ]);

  const [foundations, setFoundations] = useState([
    new Stack(),
    new Stack(),
    new Stack(),
    new Stack(),
  ]);

  const [stock, setStock] = useState(new Queue());
  const [currentWindow, setCurrentWindow] = useState([]);
  const [waste, setWaste] = useState(new Queue());

  useEffect(() => {
    handleNewGame();
  }, []);

  function handleNewGame() {
    const cards = [];
    const deck = new Stack();
    SUITS.forEach((suit) => {
      VALUES.forEach((value) => {
        cards.push({
          suit,
          value,
          faceUp: false,
          color: suit == "♦" || suit == "♥" ? "red" : "black",
          id: `${suit}-${value}`,
        });
      });
    });

    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    cards.forEach((card) => deck.push(card));

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
        const card = deck.pop();
        // console.log(deck.size())
        card.faceUp = i === j;
        newTableau[j].appendAtLast(card);
      }
    }

    // console.log()

    const newStock = new Queue();

    deck.toArray().forEach((card) => {
      newStock.enqueue(card);
    });

    setTableaus(newTableau);
    setStock(newStock);
  }

  function moveCard(fromT, toT, cardIdx) {
    const newTableau = [...tableaus];

    const fromPile = newTableau[fromT].clone()
    const toPile = newTableau[toT].clone()

    const chain = fromPile.removeSubList(cardIdx);
    const lastCard = fromPile.getLast();
    // console.log(lastCard)
    if (lastCard) {
      lastCard.data.faceUp = true;
    }
    toPile.appendSubList(chain);

    newTableau[fromT] = fromPile;
    newTableau[toT] = toPile;

    setTableaus(newTableau);
  }

  function draw() {
    if (stock.size() == 0) {
      if (waste.size() > 0) {
        const newStock = new Queue();
        const newWaste = waste;
        while (currentWindow.length > 0) {
          newWaste.enqueue(currentWindow.pop());
        }
        while (newWaste.size() > 0) {
          const card = newWaste.dequeue();
          card.faceUp = false;
          newStock.enqueue(card);
        }
        setWaste(newWaste);
        setStock(newStock);
        return;
      }
    }

    const newWaste = new Queue();
    while (waste.size() > 0) {
      newWaste.enqueue(waste.dequeue());
    }
    if (currentWindow.length > 0) {
      currentWindow.forEach((card) => newWaste.enqueue(card));
    }
    let newCurrentWindow = [];
    let newStock = stock;
    if (newStock.size() > 0) {
      if (newStock.size() >= 3) {
        for (let i = 0; i < 3; i++) {
          const card = newStock.dequeue();
          card.faceUp = true;
          newCurrentWindow.push(card);
        }
      }
    } else {
      newCurrentWindow = stock.toArray();
      newStock = new Queue();
    }

    setStock(newStock);
    setCurrentWindow(newCurrentWindow);
    setWaste(newWaste);
  }

  const cardDragStart = (event) => {
    // console.log(event.active.data.current);
  };

  const cardDragEnd = (event) => {
    const sourcePileIdx = event.active.data.current.index;
    const cardIdx = event.active.data.current.cardIdx;
    const destinationPileIdx = event.over.data.current.index;
    // console.log(sourcePileIdx + cardIdx, destinationPileIdx);
    moveCard(sourcePileIdx,destinationPileIdx,cardIdx)
  };

  return (
    <DndContext onDragStart={cardDragStart} onDragEnd={cardDragEnd}>
      <div className="min-h-screen bg-green-700 p-6 text-white">
        <h1 className="text-3xl font-bold text-center mb-4">Baby Solitaire</h1>

        <div className="flex justify-between w-full max-w-6xl">
          <div className="flex gap-5 items-center">
            <div
              className="w-20 h-28 bg-green-900 border-2 border-white rounded-lg flex items-center justify-center cursor-pointer"
              onClick={draw}
            >
              <span className="text-sm">
                {stock.size() > 0 ? `Stock ${stock.size()}` : "REDEAL"}
              </span>
            </div>
            <div className="flex gap-2">
              {currentWindow.map((card, i) => (
                <Card key={i} card={card} />
              ))}
            </div>
          </div>

          <div className="flex space-x-3">
            {foundations.map((foundation, i) => {
              return (
                <div
                  key={i}
                  className="w-20 h-28 bg-green-900 border-2 border-white rounded-lg flex flex-col items-center justify-center"
                >
                  <span className={`text-2xl`}>{SUITS[i]}</span>
                  <span className="text-xs mt-1">{0}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center space-x-3 mt-8">
          {tableaus.map((pile, i) => 
            <Pile key={i} pile={pile} pileIdx={i} />
          )}
        </div>

        <Controls reset={() => handleNewGame()} />
      </div>
    </DndContext>
  );
};

export default GameBoard;
