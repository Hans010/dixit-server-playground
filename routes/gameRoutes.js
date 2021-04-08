import express from "express";
import {joinGame, getLastGameId} from '../controllers/gameController.js';

const router = express.Router();

router.post('/start', joinGame);
router.get('/latest', getLastGameId);

export default router;