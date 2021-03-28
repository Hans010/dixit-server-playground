import mongoose from "mongoose";
import cardModel from "./cardModel.js";

const gameSchema = mongoose.Schema({
    deck: [],
    discard: [],
    players: [],
    // score: {type: [roundSchema], default: []},
    date: {type: Date, default: Date.now()}
})



const Game = mongoose.model('Game', gameSchema);

export default Game;
