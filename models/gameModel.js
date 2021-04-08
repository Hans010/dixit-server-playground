import mongoose from "mongoose";

const gameSchema = mongoose.Schema({
    deck: [],
    discard: [],
    players: [],
    storyTeller: String,
    date: {type: Date, default: Date.now(),
    rounds: []}
})



const Game = mongoose.model('Game', gameSchema);

export default Game;
