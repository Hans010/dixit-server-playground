import Game from "../models/gameModel.js";
import {initDeck, updateDecksFromGame} from "./cardController.js";
import {io} from "../service/socketIO.js";

let currentGame = {};
export let players = [];

//  GAME

export const startGame = async () => {

    console.log('start game from server');

    const newGame = await startNewGame();

    try {
        currentGame = await new Game(newGame).save();
    } catch (error) {
        console.log(error);
    }
    console.log('got game', currentGame);
}

export const joinGame = async (req, res) => {

    console.log('currentGame from join', currentGame);
    const newPlayer = req.body.player;
    console.log('new player wants to join', newPlayer);
    if (players.length === 0 || players.every(player => player._id !== newPlayer._id)) {
        players.push(newPlayer);
        currentGame = {...currentGame._doc, players: players};
        currentGame = await Game.findByIdAndUpdate(currentGame._id, currentGame, {new: true});

        io.emit('player joined', newPlayer);


        try {
            res.status(201).json({_id: currentGame._id, players: currentGame.players});
        } catch (error) {
            res.status(409).json({message: error});
        }
    }
}

const startNewGame = async () => {
    const startingDeck = await initDeck();

    return {
        deck: startingDeck,
        discard: [],
    }
}

// CARDS

export const updateDeck = async (cardsDrawn) => {

    console.log('currentGame', currentGame);

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

