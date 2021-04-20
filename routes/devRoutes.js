import express from 'express';
import {resetMongoCollections} from "../controllers/devController.js";

const router = express.Router();

// router.get('/startingHand', startingHand);
// router.post('/playCard', playCard);
// router.get('/newHand', newHand); // será necessário?

router.get('/resetMongo', resetMongoCollections);

export default router;