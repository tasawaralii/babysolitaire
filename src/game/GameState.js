import LinkedList from "../dataStructures/LinkedList";
import Stack from "../dataStructures/Stack";
import Queue from "../dataStructures/Queue";
import { useState, useEffect } from "react";
import constants from "../utils/constants"
import MoveValidator from "./MoveValidator"

const {SUITS, RANKS} = constants

export default function GameState() {
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
      score,
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
    const newUndoStack = undoStack.copy();
    newUndoStack.push(currentState);
    setUndoStack(newUndoStack);
    setRedoStack(new Stack());
  }

  function handleUndo() {
    if (undoStack.size() === 0) return;
    const newUndoStack = undoStack.copy();
    const prevState = newUndoStack.pop();
    const currentState = getGameSnapshot();
    const newRedoStack = redoStack.copy();
    newRedoStack.push(currentState);
    setMoves((prevMoves) => prevMoves + 1);
    setUndoStack(newUndoStack);
    setRedoStack(newRedoStack);
    loadGameSnapshot(prevState);
  }

  function handleRedo() {
    if (redoStack.size() === 0) return;
    const newRedoStack = redoStack.copy();
    const nextState = newRedoStack.pop();
    const currentState = getGameSnapshot();
    const newUndoStack = undoStack.copy();
    newUndoStack.push(currentState);
    setMoves((prevMoves) => prevMoves + 1);
    setUndoStack(newUndoStack);
    setRedoStack(newRedoStack);
    loadGameSnapshot(nextState);
  }

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
          color: suit === "♦" || suit === "♥" ? "red" : "black",
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
    setScore(0);
    setMoves(0);
    setUndoStack(new Stack());
    setRedoStack(new Stack());
    
  }

  function moveCardBetweenPiles(fromT, toT, cardIdx) {
    const newTableau = [...tableaus];
    const fromPile = newTableau[fromT].clone();
    const toPile = newTableau[toT].clone();
    const chain = fromPile.removeSubList(cardIdx);
    const lastCard = fromPile.getLast();
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
    if (currentWindow.length === 0 && stock.size() === 0 && waste.size() === 0)
      return;
    saveUndoRedoStack();
    setMoves((prevMoves) => prevMoves + 1);

    if (stock.size() === 0) {
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
    }
    setCurrentWindow(newCurrentWindow);
    setWaste(newWaste);
    return card;
  };

  const peekPileCard = (pileIndex) => {
    const destinationCardNode = tableaus[pileIndex].getLast();
    return destinationCardNode ? destinationCardNode.data : null;
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
    }

    if (pointsAwarded !== 0) {
      saveUndoRedoStack();
      setScore((prevScores) => prevScores + pointsAwarded);
      setMoves((prevMoves) => prevMoves + 1);
    }
  }

  return {
    moveCardToDestination,
    moves,
    score,
    draw,
    stock,
    tableaus,
    waste,
    currentWindow,
    foundations,
    handleNewGame,
    handleRedo,
    handleUndo,
    undoPossible: undoStack.size() !== 0,
    redoPossible: redoStack.size() !== 0,
    stockSize: stock.size(),
  };
}
