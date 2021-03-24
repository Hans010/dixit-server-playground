import mongoose from "mongoose";

 const cardSchema = mongoose.Schema({
    playedBy: {type: String},
    storyTeller: {type: Boolean, default: false},
    imageUrl: {type: String}
})

const Card = mongoose.model('Card', cardSchema);

export default Card;