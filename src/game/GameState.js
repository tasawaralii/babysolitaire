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
}
