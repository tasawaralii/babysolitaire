export default {
    toPile: (sourceCard, destinationCard) => {
        if(!destinationCard) {
            return sourceCard.rank == 13
        }
        if(sourceCard.color == destinationCard.color) {
            console.log("Same Color Not Allowed")
            return false
        }
        if(sourceCard.rank > destinationCard.rank) {
            console.log("Rank in Bigger")
            return false
        }
        if(destinationCard.rank - sourceCard.rank != 1) {
            console.log("Not Consective Cards")
            return false
        }

        return true
    },
    toFoundation: (foundationSuit, newCard, currentCard) => {
        if(foundationSuit != newCard.suit) {
            console.log("Not Same Suit")
            return false
        }
        if(!currentCard) {
            if(newCard.rank != 1) {
                console.log("Foundation can be initialized by Ace Card Only")
                return false
            } else {
                return true
            }
        }
        if(newCard.rank - currentCard.rank != 1) {
            console.log("Not Consective Card")
            return false
        }
        return true
    }

}