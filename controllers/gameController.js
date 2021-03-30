import Game from "../models/gameModel.js";
import {initDeck, updateDecksFromGame} from "./cardController.js";
import mongoose from "mongoose";

let currentGame = {};
export let players = [];

export const startGame = async (req, res) => {

    console.log('start game');

    if (currentGame?._id) {
        console.log('I already have a game');
        updateDecksFromGame(currentGame.deck, currentGame.discard);
        try {
            res.status(201).json(currentGame._id);
        } catch (error) {
            res.status(409).json({message: error});
        }
        return
    }

    currentGame = await Game.findById(req.body.gameId);

    if (currentGame) {
        console.log('retrieving an existing game');
        await updateExistingGame(currentGame);
    } else {
        console.log('creating a new game ');
        const newGame = await startNewGame();
        try {
            currentGame = await new Game(newGame).save();
        } catch (error) {
            console.log(error);
        }
    }

    try {
        res.status(201).json(currentGame._id);
    } catch (error) {
        res.status(409).json({message: error});
    }
}

const updateExistingGame = (currentGame) => async (req, res) => {
    updateDecksFromGame(currentGame.deck, currentGame.discard);
}

const startNewGame = async (currentGame) => {
    const startingDeck = await initDeck();

    const newGame = {
        deck: startingDeck,
        discard: [],
    }

    return newGame

}

export const updateDeck = async (cardsDrawn) => {

    const newDeck = currentGame.deck.filter(card => (
        !cardsDrawn.some(({_id}) => {
            return JSON.stringify(_id) === JSON.stringify(card._id);
        })
    ));

    const newDiscard = currentGame.discard.concat(cardsDrawn);

    const updatedGame = {...currentGame._doc, deck: newDeck, discard: newDiscard, date: new Date()};

    return Game.findByIdAndUpdate(updatedGame._id, updatedGame, {new: true});
}

export const registerPlayer = async (req, res) => {
    const player = req.body;

    try {

    } catch (error) {

    }
}

export const addPlayer = (newPlayer) => {
    if (players.length === 0 || players.every(player => player._id !== newPlayer._id))
        players.push(newPlayer);
    console.log('added player', players);
}

