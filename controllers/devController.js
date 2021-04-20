import Game from '../models/gameModel.js';
import Round from "../models/roundModel.js";
import Player from "../models/playerModel.js";

export const resetMongoCollections = async (req, res) => {
    console.log('resetting');
    await Game.collection.drop();
    await Round.collection.drop();
    await Player.collection.drop();

    try {
        res.status(201).json({msg: 'All is dust'});
    } catch (error) {
        res.status(409).json({message: error});
    }

}