class MoveValidator {
  static toPile(sourceCard, destinationCard) {
    if (!destinationCard) return sourceCard.rank === 13;
    return (
      sourceCard.color !== destinationCard.color &&
      sourceCard.rank === destinationCard.rank - 1
    );
  }

  static toFoundation(suit, sourceCard, topCard) {
    if (sourceCard.suit !== suit) return false;
    if (!topCard) return sourceCard.rank === 1;
    return sourceCard.rank === topCard.rank + 1;
  }
}
export default MoveValidator