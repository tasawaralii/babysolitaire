export default class GameState {
  constructor(deck) {
    this.deck = deck;
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
    for (let i = 0; i < 7; i++) {
      for (let j = i; j < 7; j++) {
        const card = this.deck.draw();
        card.faceUp = i == j;
        this.tableau[j].push(card);
      }
    }
    this.stock = this.deck.cards;
    this.deck.cards = [];
  }
}
