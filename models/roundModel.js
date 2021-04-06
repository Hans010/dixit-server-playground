import mongoose from "mongoose";
// import {cardSchema} from './cardModel.js';

const roundSchema = mongoose.Schema({
    story: String,
    cardsInPlay: [{

    }]
})

const Round = mongoose.model('Round', roundSchema);

export default Round;