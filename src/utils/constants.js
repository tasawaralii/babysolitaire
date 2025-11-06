export default {
  SUITS: ["♠", "♥", "♦", "♣"],
  RANKS: [
    { value: "A", rank: 1 },
    { value: "2", rank: 2 },
    { value: "3", rank: 3 },
    { value: "4", rank: 4 },
    { value: "5", rank: 5 },
    { value: "6", rank: 6 },
    { value: "7", rank: 7 },
    { value: "8", rank: 8 },
    { value: "9", rank: 9 },
    { value: "10", rank: 10 },
    { value: "J", rank: 11 },
    { value: "Q", rank: 12 },
    { value: "K", rank: 13 },
  ],
  DEFAULT_SETTINGS : {
    drawCount: 3,
    scoring: {
      wasteToTableau: 10,
      wasteToFoundation: 15,
      tableauToTableau: 5,
      tableauToFoundation: 30,
      foundationToTableau: -30,
    },
    countUndoRedo: true,
    timedGame: true,
    vegasScoring: true,
    soundEffects:false,
  }
};
