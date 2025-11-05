import React, { useEffect, useState } from "react";

import Controls from "../components/Controls";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import LinkedList from "../dataStructures/LinkedList";
import Stack from "../dataStructures/Stack";
import Queue from "../dataStructures/Queue";
import MoveValidator from "../game/MoveValidator";

const SUITS = ["♠", "♥", "♦", "♣"];
const RANKS = [
  { value: "A", rank: 1 },
  { value: "02", rank: 2 },
  { value: "03", rank: 3 },
  { value: "04", rank: 4 },
  { value: "05", rank: 5 },
  { value: "06", rank: 6 },
  { value: "07", rank: 7 },
  { value: "08", rank: 8 },
  { value: "09", rank: 9 },
  { value: "10", rank: 10 },
  { value: "J", rank: 11 },
  { value: "Q", rank: 12 },
  { value: "K", rank: 13 },
];

const Card = ({ card }) => {
  return (
    <div
      className={`w-16 h-8 rounded-md border ${
        card.faceUp ? "cursor-pointer" : ""
      } text-center text-sm ${
        card.faceUp
          ? `bg-white ${card.color == "red" ? "text-red-700" : "text-black"}`
          : "bg-blue-900 text-blue-900"
      }`}
    >
      {card.faceUp ? `${card.value}${card.suit}` : ""}
    </div>
  );
};
const Pile = ({ pile, pileIdx }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `pile-${pileIdx}`,
    data: { destination: "pile", destinationIdx: pileIdx },
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
        {pile
          .toArray()
          .map((card, j) =>
            card.faceUp ? (
              <CardDraggable
                key={j}
                cardSource={"pile"}
                card={card}
                cardIdx={j}
                sourceIdx={pileIdx}
              />
            ) : (
              <Card key={j} card={card} />
            )
          )}
      </div>
    </div>
  );
};

const Foundation = ({ index, suit, foundation }) => {
  // if (foundation.size() > 0) {
  //   console.log(foundation.peek());
  // }

  const { isOver, setNodeRef } = useDroppable({
    id: `foundation-${suit}`,
    data: {
      destination: "foundation",
      destinationIdx: index,
    },
  });
  return (
    <div
      ref={setNodeRef}
      className={`w-20 ${
        isOver ? "bg-yellow-900" : "bg-green-900"
      } h-28 border-2 border-white rounded-lg flex flex-col items-center justify-center`}
    >
      {foundation.size() > 0 && (
        <CardDraggable
          card={foundation.peek()}
          cardSource={"foundation"}
          sourceIdx={index}
          cardIdx={foundation.size() - 1}
        />
      )}
      <span className={`text-2xl`}>{suit}</span>
      <span className="text-xs mt-1">{foundation.size()}</span>
    </div>
  );
};

const CardDraggable = ({ card, cardSource, sourceIdx, cardIdx }) => {
  if (!card) return null;
  const { setNodeRef, attributes, listeners, transform } = useDraggable({
    id: `card-${card.id}`,
    data: { cardSource, sourceIdx, cardIdx, card },
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
};

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

  const [time, setTime] = useState(0);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);

  const [undoStack, setUndoStack] = useState(new Stack());
  const [redoStack, setRedoStack] = useState(new Stack());


  function getGameSnapshot() {
    return {
      tableaus: tableaus.map((pile) => pile.clone()),
      foundations: foundations.map((f) => f.copy()),
      stock: stock.clone(),
      waste: waste.clone(),
      currentWindow: [...currentWindow],
      score
    };
  }

  function loadGameSnapshot(snapshot) {
    setTableaus(snapshot.tableaus.map((p) => p.clone()));
    setFoundations(snapshot.foundations.map((f) => f.copy()));
    setStock(snapshot.stock.clone());
    setWaste(snapshot.waste.clone());
    setCurrentWindow([...snapshot.currentWindow]);
    setScore(snapshot.score);
  }
  
  function saveUndoRedoStack() {
    const currentState = getGameSnapshot();
    const newUndoStack = undoStack.copy()
    newUndoStack.push(currentState);

    setUndoStack(newUndoStack);
    setRedoStack(new Stack())
  }

  function handleUndo() {
    if(undoStack.size() == 0) return null;
    const newUndoStack = undoStack.copy();
    const prevState = newUndoStack.pop();
    const currentState = getGameSnapshot();
    const newRedoStack = redoStack.copy();
    newRedoStack.push(currentState);

    setMoves((prevMoves) => prevMoves + 1)
    setUndoStack(newUndoStack)
    setRedoStack(newRedoStack)
    loadGameSnapshot(prevState)
  }

  function handleRedo() {
    if(redoStack.size() == 0) return null;
    const newRedoStack = redoStack.copy();
    const nextState = newRedoStack.pop();
    const currentState = getGameSnapshot();
    const newUndoStack = undoStack.copy();
    newUndoStack.push(currentState);

    setMoves((prevMoves) => prevMoves + 1)
    setUndoStack(newUndoStack)
    setRedoStack(newRedoStack)
    loadGameSnapshot(nextState)
  }


  useEffect(() => {
    handleNewGame();

    const timeInterval = setInterval(() => {
      setTime((prev) => prev + 1)
    },1000)

    return () => clearInterval(timeInterval);

  }, []);

  function handleNewGame() {
    const cards = [];
    const deck = new Stack();
    SUITS.forEach((suit) => {
      RANKS.forEach((value) => {
        cards.push({
          suit,
          value: value.value,
          rank: value.rank,
          faceUp: false,
          color: suit == "♦" || suit == "♥" ? "red" : "black",
          id: `${suit}-${value.value}`,
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
        card.faceUp = i === j;
        newTableau[j].appendAtLast(card);
      }
    }

    const newStock = new Queue();

    deck.toArray().forEach((card) => {
      newStock.enqueue(card);
    });

    const newFoundations = [new Stack(), new Stack(), new Stack(), new Stack()];
    const newWaste = new Queue();

    setWaste(newWaste);
    setCurrentWindow([]);
    setFoundations(newFoundations);
    setTableaus(newTableau);
    setStock(newStock);
    setTime(0)
    setScore(0)
  }

  function moveCardBetweenPiles(fromT, toT, cardIdx) {
    const newTableau = [...tableaus];

    const fromPile = newTableau[fromT].clone();
    const toPile = newTableau[toT].clone();

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

  function insertInPileState(index, sublist) {
    const newTableau = [...tableaus];
    const newPile = newTableau[index].clone();
    newPile.appendSubList(sublist);
    newTableau[index] = newPile;
    setTableaus(newTableau);
  }

  function insertToFoundationState(index, card) {
    card.faceUp = true;
    setFoundations((prevFoundations) => {
      const newFoundations = [...prevFoundations];
      const changedFoundation = newFoundations[index].copy();
      changedFoundation.push(card);
      newFoundations[index] = changedFoundation;
      return newFoundations;
    });
  }

  function draw() {

    if(currentWindow.length == 0 && stock.size() == 0 && waste.size() == 0) return null;

    saveUndoRedoStack()

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
    let newStock = stock.clone();

    if (newStock.size() >= 3) {
      for (let i = 0; i < 3; i++) {
        const card = newStock.dequeue();
        card.faceUp = true;
        newCurrentWindow.push(card);
      }
    } else {
      newCurrentWindow = newStock.toArray();
      for (let i = 0; i < newCurrentWindow.length; i++)
        newCurrentWindow[i].faceUp = true;
      newStock = new Queue();
    }

    setStock(newStock);
    setCurrentWindow(newCurrentWindow);
    setWaste(newWaste);
  }

  const cardDragStart = (event) => {
    // console.log(event.active);
  };

  const removeFromPileState = (pileIdx, cardIdx) => {
    const newTableau = [...tableaus];

    const fromPile = newTableau[pileIdx].clone();
    const chain = fromPile.removeSubList(cardIdx);

    const lastCard = fromPile.getLast();

    if (lastCard) {
      lastCard.data.faceUp = true;
    }

    newTableau[pileIdx] = fromPile;
    setTableaus(newTableau);
    return chain;
  };
  const removeFromFoundationState = (index) => {
    let card;
    setFoundations((prevFoundations) => {
      const newFoundations = [...prevFoundations];
      const newFoundation = newFoundations[index].copy();
      card = newFoundation.pop();
      newFoundations[index] = newFoundation;
      return newFoundations;
    });
    return card;
  };
  const removeFromWasteState = (index) => {
    const newCurrentWindow = [...currentWindow];
    const newWaste = waste.clone();
    const card = newCurrentWindow[index];
    newCurrentWindow.splice(index, 1);
    const newCard = newWaste.dequeue();
    if (newCard) {
      newCurrentWindow.unshift(newCard);
      // console.log(newCurrentWindow);
    }
    setCurrentWindow(newCurrentWindow);
    setWaste(newWaste);
    return card;
  };

  const peekPileCard = (pileIndex) => {
    const destinationCardNode = tableaus[pileIndex].getLast();
    let destinationCard;
    if (!destinationCardNode) {
      destinationCard = null;
    } else {
      destinationCard = destinationCardNode.data;
    }
    return destinationCard;
  };
  function moveCardToDestination(
    source,
    destination,
    sourceIdx,
    destinationIdx,
    cardIdx,
    sourceCard
  ) {

    let pointsAwarded = 0;

    switch (source) {
      case "pile":
        if (destination === "pile") {
          const destinationCard = peekPileCard(destinationIdx);
          if (MoveValidator.toPile(sourceCard, destinationCard)) {
            moveCardBetweenPiles(sourceIdx, destinationIdx, cardIdx);
            pointsAwarded = 10;

          } else {
            console.log("Invalid move to pile");
          }
        } else if (destination === "foundation") {
          if (
            MoveValidator.toFoundation(
              SUITS[destinationIdx],
              sourceCard,
              foundations[destinationIdx].peek()
            )
          ) {
            insertToFoundationState(
              destinationIdx,
              removeFromPileState(sourceIdx, cardIdx).data
            );
            pointsAwarded = 20;
          }
        }
        break;
      case "waste":
        if (destination === "pile") {
          if (MoveValidator.toPile(sourceCard, peekPileCard(destinationIdx))) {
            const card = removeFromWasteState(cardIdx);
            const list = new LinkedList();
            list.appendAtFirst(card);
            insertInPileState(destinationIdx, list.head);
            pointsAwarded = 5;
          }
        } else if (destination === "foundation") {
          if (
            MoveValidator.toFoundation(
              SUITS[destinationIdx],
              sourceCard,
              foundations[destinationIdx].peek()
            )
          ) {
            const card = removeFromWasteState(cardIdx);
            insertToFoundationState(destinationIdx, card);
            pointsAwarded = 15;
          }
        }
        break;
      case "foundation":
        if (destination === "pile") {
          if (MoveValidator.toPile(sourceCard, peekPileCard(destinationIdx))) {
            const card = removeFromFoundationState(sourceIdx);
            insertInPileState(
              destinationIdx,
              new LinkedList().appendAtFirst(card)
            );

            pointsAwarded = -5;
          }
        }
        break;
      default:
        console.log("Invalid move");
    }

    if(pointsAwarded != 0) {

      saveUndoRedoStack()

      setScore((prevScores) => prevScores + pointsAwarded)
      setMoves((prevMoves) => prevMoves + 1)
    }

  }

  const cardDragEnd = (event) => {
    if (!event.over) return null;

    const sourceCard = event.active.data.current.card;
    const source = event.active.data.current.cardSource;
    const cardIdx = event.active.data.current.cardIdx;
    const sourceIdx = event.active.data.current.sourceIdx;

    const destination = event.over.data.current.destination;
    const destinationIdx = event.over.data.current.destinationIdx;

    if (source == destination && sourceIdx == destinationIdx) return null;

    moveCardToDestination(
      source,
      destination,
      sourceIdx,
      destinationIdx,
      cardIdx,
      sourceCard
    );
    // console.log(
    //   `Card : ${cardIdx} ${cardId}\n` +
    //     `Source : ${source}, Index ${sourceIdx}\n` +
    //     `Destination: ${destination}, Index ${destinationIdx}`
    // );
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
                <p>{stock.size() > 0 ? `Stock ${stock.size()}` : "REDEAL"}</p>
                <p>{`Waste ${waste.size()}`}</p>
                <p>{`Current ${currentWindow.length}`}</p>
              </span>
            </div>
            <div className="flex gap-2">
              {currentWindow.map((card, i) => (
                <CardDraggable
                  key={i}
                  card={card}
                  cardSource={"waste"}
                  sourceIdx={i}
                  cardIdx={i}
                />
              ))}
            </div>
          </div>

          <div className="flex space-x-3">
            {foundations.map((foundation, i) => {
              // console.log(foundation.peek())
              return (
                <Foundation
                  key={i}
                  index={i}
                  suit={SUITS[i]}
                  foundation={foundation}
                />
              );
            })}
          </div>
        </div>

        <div className="flex justify-center space-x-3 mt-8">
          {tableaus.map((pile, i) => (
            <Pile key={i} pile={pile} pileIdx={i} />
          ))}
        </div>

        <Controls
          reset={() => handleNewGame()}
          handleRedo={handleRedo}
          handleUndo={handleUndo}
          disableRedo={redoStack.size() === 0}
          disableUndo={undoStack.size() === 0}
        />
        <div className="flex gap-3">
          Time: {Math.floor(time / 60)}:{("0" + (time % 60)).slice(-2)}
          <div>Moves : {moves}</div>
          <div>Scores : {score}</div>
        </div>
      </div>
    </DndContext>
  );
};

export default GameBoard;
