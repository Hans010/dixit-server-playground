import Game from "../models/gameModel.js";
import Round from "../models/roundModel.js";
import Card from "../models/cardModel.js";
import {initDeck} from "./cardController.js";

let gameId = '';
let story = '';
let players = [];

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
        res.status(201).json(gameId);
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

    const newDiscard = game.discard.concat(cardsDrawn);

    const updatedGame = {...game._doc, deck: newDeck, discard: newDiscard, date: new Date()};

    const gamez = Game.findByIdAndUpdate(updatedGame._id, updatedGame, {new: true});
    // console.log(gamez);
    return gamez;
}

export const submitStory = async (req, res) => {
    story = req?.body.story || 'I have no story';

    try {
        const round = await new Round({story: story}).save();
        res.status(200).json(story);
    } catch (error) {
        res.status(409).json({message: error});
    }
}

export const registerPlayer = async (req, res) => {
    const player = req.body;

    try {

    } catch (error) {

    }
}

export const reshuffleDeck = () => {
    const game = Game.findById(gameId);
    const newDeck = game.deck.concat(game.discard).sort(() => Math.random() - 0.5);
    Game.findByIdAndUpdate(gameId, {...game._doc, deck: newDeck, discard: []});
    return newDeck;
}

export const addPlayer = (newPlayer) => {
    if (players.length === 0 || players.every(player => player._id !== newPlayer._id))
        players.push(newPlayer);
}
