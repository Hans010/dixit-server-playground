import express from "express";
import {startGame, submitStory} from '../controllers/gameController.js';

const router = express.Router();

router.post('/start', startGame);
router.post('/story', submitStory);

export default router;