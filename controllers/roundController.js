
let story = '';
let cardsInPlay = [];
let cardVotes = [];

export const submitStory = (newStory) => {
    story = newStory;
}

export const addCardToPlay = card => {
    cardsInPlay.push(card);
    return cardsInPlay;
}

export const newRound = () => {
    story = '';
    cardsInPlay = [];
    return cardsInPlay;
}

export const voteInCard = (cardVote) => {
    if (cardsInPlay.filter(card => (
        card._id === cardVote.cardId)
        ).length !== 1
    ) {
        console.log('invalid card! card voted not in array');
        console.log('cards in play', cardsInPlay);
        console.log('card vote', cardVote);
        return false;
    } else {
        cardVotes.push(cardVote);
        console.log('new vote added', cardVotes);
        return true;
    }
}