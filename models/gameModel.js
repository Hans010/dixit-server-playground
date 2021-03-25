import mongoose from "mongoose";
import cardModel from "./cardModel.js";

const gameSchema = mongoose.Schema({
    deck: [],
    discard: [],
    // score: {type: [roundSchema], default: []},
    date: {type: Date, default: Date.now()}
})

// const playerMoveSchema = mongoose.Schema({
//     playerId: String,
//     cardPlayed: String,
//     score: Number,
//     storyTeller: Boolean,
//     storyWin: Boolean,
//     extraPoints: {type: Number, default: 0}
// });
//
// const roundSchema = mongoose.Schema({
//     round: [playerMoveSchema],
//     story: String
// });

const Game = mongoose.model('Game', gameSchema);

export default Game;
