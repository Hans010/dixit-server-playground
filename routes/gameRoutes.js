import express from "express";
import {joinGame, startGame,} from '../controllers/gameController.js';

const router = express.Router();

router.post('/start', joinGame);

export default router;