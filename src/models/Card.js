export default class Card {
  constructor(suit, rank, faceup = false) {
    this.suit = suit;
    this.rank = rank;
    this.faceup = faceup;
    this.color = ["heart", "diamond"].includes(suit) ? "red" : "black";
  }
  flip() {
    this.faceup = !this.faceup;
  }
}
