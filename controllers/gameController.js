import Game from "../models/gameModel.js";
import {initDeck, updateDecksFromGame} from "./cardController.js";

let currentGame = {};
export let players = [];

// GAME

export const startGame = async (req, res) => {

    console.log('start game');

    console.log('do i have a game?', currentGame?.players);

    // if there isn't a game already, start a new game

    if (!currentGame?._id) {

        const newGame = await startNewGame();
        try {
            currentGame = await new Game(newGame).save();
        } catch (error) {
            console.log(error);
        }
    }

    // send game ID and players to client
    try {
        res.status(201).json({_id: currentGame._id, players: currentGame.players});
    } catch (error) {
        res.status(409).json({message: error});
    }
}

const startNewGame = async (currentGame) => {
    const startingDeck = await initDeck();

    const newGame = {
        deck: startingDeck,
        discard: [],
    }

    return newGame

}

// CARDS

export const updateDeck = async (cardsDrawn) => {

    const newDeck = currentGame.deck.filter(card => {
     // console.log('card match? ', typeof card, typeof cardsDrawn[0], card === cardsDrawn[0]);
        (
            !cardsDrawn.some(({_id}) => {
                return JSON.stringify(_id) === JSON.stringify(card._id);
            })
        )
    });


    currentGame = {...currentGame._doc, deck: newDeck, date: new Date()};

    return Game.findByIdAndUpdate(currentGame._id, currentGame, {new: true});
}

export const updateReshuffledGame = async (newDeck) => {
    currentGame = {...currentGame._doc, deck: newDeck, discard: []};
    await Game.findByIdAndUpdate(currentGame._id, currentGame);
}

// PLAYERS

export const addPlayer = async (newPlayer) => {
    if (players.length === 0 || players.every(player => player._id !== newPlayer._id)) {
        players.push(newPlayer);
        currentGame = {...currentGame._doc, players: players};
        currentGame = await Game.findByIdAndUpdate(currentGame._id, currentGame, {new: true});
    }
}


