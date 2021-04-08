import {gameId} from "./gameController.js";
import Game from "../models/gameModel.js";
import Round from "../models/roundModel.js";

export const submitStory = async (newStory) => {
    const round = await getLastRound();
    console.log(JSON.stringify(newStory));
    console.log(round._id);
    await Round.findByIdAndUpdate(round._id, {story: JSON.stringify(newStory)});
}

export const addCardToPlay = async card => {
    const round = await getLastRound();
    const cardsInPlay = [...round.cardsInPlay, card];
    await Round.findByIdAndUpdate(round._id, {cardsInPlay: cardsInPlay});
    return cardsInPlay;
}

export const newRound = async () => {

    const {players} = await Game.findById(gameId);

    const newStoryTeller = players.pop();
    players.unshift(newStoryTeller);
    await Game.findByIdAndUpdate(gameId, {players: [...players]});

    await new Round({
        story: '',
        storyTeller: newStoryTeller._id,
        cardsInPlay: [],
        cardVotes: [],
        gameId: gameId,
        players: players,
    }).save();

    return newStoryTeller._id;
}

export const voteInCard = async (cardVote) => {

    const {cardsInPlay, cardVotes, _id: roundId} = await getLastRound();

    if (cardsInPlay.filter(card =>
            card._id.toString() === cardVote.cardId)
    .length !== 1
    ) {
        // console.log('invalid card! card voted not in array');
        console.log('cards in play', cardsInPlay);
        console.log('card vote', cardVote);
        return false;
    } else {
        cardVotes.push(cardVote);
        console.log('new vote added', cardVotes);
        await Round.findByIdAndUpdate(roundId, {cardVotes: [...cardVotes]});
        return true;
    }
}


export const getLastRound = async () => {

    const lastRound = await Round.find().sort({_id: -1}).limit(1);
    console.log('lastround id', lastRound[0]._id);
    return lastRound[0];
}