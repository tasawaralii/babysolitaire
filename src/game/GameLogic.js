export default GameLogic = () => {
    moveCardBetweentableau : ({tableaus, from, to, card})=> {
        const newtableas = [...tableaus]
        newtableas[to].push(card)
        return newtableas;
    }
}