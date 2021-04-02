
let story = '';
let cardsInPlay = [];

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
}