import mongoose from "mongoose";
// import {cardSchema} from './cardModel.js';

const playerSchema = mongoose.Schema({
    name: String,
    // hand: [cardSchema],
    score: Number
})

const Player = mongoose.model('Player', playerSchema);

export default Player;