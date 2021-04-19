import mongoose from "mongoose";

const roundSchema = mongoose.Schema({
    story: String,
    storyTeller: String,
    cardsInPlay: [{
        playedBy: {type: String},
        storyTeller: {type: Boolean, default: false},
        imageUrl: {type: String}
    }],
    cardVotes: [{
        cardVoted: String,
        playerId: String,
        cardPlayed: String
    }],
    gameId: String,
    players: [],
    date: {type: Date, default: Date.now()},
})

const Round = mongoose.model('Round', roundSchema);

export default Round;