import express from "express";
import {startGame} from '../controllers/gameController.js';

const router = express.Router();

router.post('/start', startGame);

export default router;