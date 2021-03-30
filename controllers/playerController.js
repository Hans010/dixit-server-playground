import mongoose from "mongoose";
import Player from '../models/playerModel.js';
import {addPlayer, players} from "./gameController.js";

export const getPlayers = async (req, res) => {
    try {
        const players = await Player.find();
        res.status(200).json(players);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

export const createPlayer = async (req, res) => {
    if (players.every(player => player.clientId !== req.body.clientId)) {
        try {
            const generatedPlayer = await new Player(req.body).save();
            res.status(201).json(generatedPlayer);
            addPlayer(generatedPlayer);
        } catch (error) {
            res.status(409).json({message: error.message});
        }
    } else {
        console.log('player already exists');
    }
}

export const getPlayer = async (req, res) => {

    // This is an alias
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("Oh no! I can't find this player! Now it's somewhere all alone! I need a moment...");

    const player = await Player.findById(id);
    res.status(200).json(player);
}

export const deletePlayer = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("Oh no! I can't find this player! Now it's somewhere all alone! I need a moment...");

    const deletedPlayer = await Player.findByIdAndDelete(id);
    res.status(200).json(deletedPlayer);
}


