import Card from "./Card";
export default class Deck {
  constructor() {
    this.cards = [];
    const suits = ["heart", "diamond", "spade", "club"];
    const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    for (let suit of suits) {
      for (let rank of ranks) {
        this.cards.push(new Card(suit, rank));
      }
    }
  }
  shuffle() {
    for (let i = 0; i < this.cards.length; i++) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j],this.cards[i]];
    }
  }

  draw() {
    return this.cards.pop();
  }
  print() {
    console.log(this.cards)
  }
}
