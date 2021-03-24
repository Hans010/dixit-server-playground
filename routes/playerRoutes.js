import express from 'express';
import {createPlayer, deletePlayer} from "../controllers/playerController.js";

const router = express.Router();

router.post('/addPlayer', createPlayer);
router.post('/removePlayer', deletePlayer);

export default router;