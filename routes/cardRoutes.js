import express from "express";
import {createCard, dealCards, getCards} from "../controllers/cardController.js";

const router = express.Router();

router.get('/', getCards);
router.get('/:cards', dealCards);
router.post('/newCard', createCard);

export default router;