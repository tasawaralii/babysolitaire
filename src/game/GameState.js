import Deck from "../models/Deck";
export default class GameState {
  constructor() {
    this.tableau = Array(7)
      .fill()
      .map(() => []);
    this.foundation = { heart: [], diamond: [], spade: [], club: [] };
    this.stock = [];
    this.waste = [];
    this.undoStack = [];
    this.redoStack = [];
  }

  initializeGame() {
    const deck = new Deck();
    deck.shuffle();

    for (let i = 0; i < 7; i++) {
      for (let j = i; j < 7; j++) {
        const card = deck.draw();
        card.faceUp = i == j;
        this.tableau[j].push(card);
      }
    }
    this.stock = deck.cards;
  }
}
