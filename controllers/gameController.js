import Game from "../models/gameModel.js";
import {initDeck} from "./cardController.js";
import {io} from "../service/socketIO.js";
import Round from "../models/roundModel.js";

export let gameId = '';

//  GAME

export const startGame = async () => {

    console.log('start game from server ');

    const startgame = await startNewGame();
    try {
        const {_id: id} = await new Game(startgame).save();
        gameId = id;
    } catch (error) {
        console.log(error);
    }
    console.log('game ID', gameId);
}

export const joinGame = async (req, res) => {

    const newPlayer = req.body.player;
    const game = await Game.findById(gameId);

    const players = [...game.players];

    if (players.length === 0 || players.every(player => player._id !== newPlayer._id)) {
        players.push(newPlayer);
        const updatedGame = {...game._doc, players: players};
        await Game.findByIdAndUpdate(gameId, updatedGame, {new: true});

        io.emit('player joined', newPlayer);
    }

    try {
        res.status(201).json({_id: gameId, players: players});
    } catch (error) {
        res.status(409).json({message: error});
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


export const getLastGameId = async (req, res) => {
    const lastGame = await Round.find().sort({_id: -1}).limit(1);
    console.log('latestgame ', lastGame[0]._id);
    try {
        res.status(200).json({_id: lastGame[0]._id});
    } catch (error) {
        res.status(409).json({message: error});
    }
}
