import mongoose from "mongoose";
import Player from '../models/playerModel.js';

export const getPlayers = async (req, res) => {
    try {
        const players = await Player.find();
        res.status(200).json(players);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

export const createPlayer = async (req, res) => {

    const newPlayer = new Player({...res.body});

    try {
        await newPlayer.save();
        res.status(201).json(newPlayer);
    } catch (error) {
        res.status(409).json({message: error.message});
    }
}

export const getPlayer = async (req,res) => {

    // This is an alias
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("Oh no! I can't find this player! Now it's somewhere all alone! I need a moment...");

    const player = await Player.findById(id);
    res.status(200).json(player);
}

export const deletePlayer =  async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("Oh no! I can't find this player! Now it's somewhere all alone! I need a moment...");

    const deletedPlayer = await Player.findByIdAndDelete(id);
    res.status(200).json(deletedPlayer);
}


