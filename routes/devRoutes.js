import express from 'express';
import {resetMongoCollections} from "../controllers/devController.js";

const router = express.Router();

router.get('/resetMongo', resetMongoCollections);

export default router;