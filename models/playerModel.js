import mongoose from "mongoose";
// import {cardSchema} from './cardModel.js';

const playerSchema = mongoose.Schema({
    name: String,
    clientId: String,
    score: {type: Number, default: 0},
    imgUrl: {type: String, default: ''},
    ready2Play: {type: Boolean, default: false},
    date: {type: Date, default: Date.now()},
})

const Player = mongoose.model('Player', playerSchema);

export default Player;