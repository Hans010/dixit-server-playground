import Game from "../models/gameModel.js";
import Card from "../models/cardModel.js";
import {initDeck} from "./cardController.js";

let gameId = '';

export const startGame = async (req, res) => {

    const startingDeck = await initDeck();

    const game = {
        deck: startingDeck,
        discard: [],
    }

    if (startingDeck) console.log('starting game');

    try {
        const startedGame = await new Game(game).save();
        gameId = startedGame._id;
        res.status(201).json(game);
    } catch (error) {
        res.status(409).json({message: error});
    }
};

export const updateDeck = async (cardsDrawn) => {

    let game = {};
    try {
        game = await Game.findById(gameId);
    } catch (error) {
        console.log(error);
    }

    const newDeck = game.deck.filter(card => (
        !cardsDrawn.some(({_id}) => {
            return JSON.stringify(_id) === JSON.stringify(card._id);
        })
    ));

    const updatedGame = {...game._doc, deck: newDeck, date: new Date()};

    const gamez =  Game.findByIdAndUpdate(updatedGame._id, updatedGame, {new: true});
    // console.log(gamez);
    return gamez;
}