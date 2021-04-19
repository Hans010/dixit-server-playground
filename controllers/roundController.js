import {gameId} from "./gameController.js";
import Game from "../models/gameModel.js";
import Round from "../models/roundModel.js";
import Player from "../models/playerModel.js";

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

    const {cardsInPlay, cardVotes, _id: roundId, players, storyTeller} = await getLastRound();

    if (cardsInPlay.filter(card =>
        card._id.toString() === cardVote.cardVoted)
        .length !== 1
    ) {
        console.log('no such card');
        return false;
    }

    if (!cardVotes.every(vote => vote.playerId !== cardVote.playerId)) {
        console.log('no such player');
        return false;
    }

    if (cardVote.playerId === storyTeller) {
        console.log('storyTeller cannot vote!')
        return false;
    }

    cardVotes.push(cardVote);
    // console.log('new vote added', cardVotes);
    await Round.findByIdAndUpdate(roundId, {cardVotes: [...cardVotes]});
    return {allVotes: players.length - 1 === cardVotes.length};
}

export const resolveVotes = async () => {
    let scoreBoard = {};
    const {players, storyTeller, cardsInPlay, cardVotes} = await getLastRound();
    const storyCard = cardsInPlay.filter(card => {
        return card.playedBy === storyTeller;
    })[0];

    const votesOnStoryteller = cardVotes.filter(vote => {
        return vote.cardVoted === JSON.stringify(storyCard._id).replace(/["]+/g, '');
    });

    //Storyteller score check
    // if storyteller has some but not all votes
    if (votesOnStoryteller.length > 0 && votesOnStoryteller.length < cardVotes.length) {

        const {score: oldScore} = await Player.findById(storyTeller);
        const {score} = await Player.findByIdAndUpdate(storyTeller, {score: oldScore + 3}, {new: true});
        scoreBoard[storyTeller] = score;
        for (let i = 0; i < votesOnStoryteller.length; i++) {
            let addedScore = 3;
            const extraPoints = cardVotes.filter(card => card.cardVoted === votesOnStoryteller[i].cardPlayed).length;

            const {score: oldScore} = await Player.findById(votesOnStoryteller[i].playerId);
            const {
                _id: pID,
                score
            } = await Player.findByIdAndUpdate(votesOnStoryteller[i].playerId, {score: oldScore + addedScore + extraPoints}, {new: true});
            scoreBoard[pID] = score;
        }
        return scoreBoard;

    } else {
        const scoreArray = players.filter(plyr => plyr._id !== storyTeller);
        for (let i = 0; i < scoreArray.length; i++) {
            const {score: oldScore} = await Player.findById(scoreArray[i]._id);
            const {
                _id: pID,
                score
            } = await Player.findByIdAndUpdate(scoreArray[i]._id, {score: oldScore + 2}, {new: true});
            scoreBoard[pID] = score;
        }
        return scoreBoard;
    }
}


export const getLastRound = async () => {
    const lastRound = await Round.find().sort({_id: -1}).limit(1);
    return lastRound[0];
}

export const test = async (playerID) => {
    const scoreBoard = {};
    const {score: oldScore} = await Player.findById(playerID);
    const updatedPlayer = await Player.findByIdAndUpdate(playerID, {score: oldScore + 2}, {new: true});
    scoreBoard[updatedPlayer._id] = updatedPlayer.score;
    return scoreBoard;
}