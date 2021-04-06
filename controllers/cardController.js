import Card from '../models/cardModel.js';
import {updateDeck, updateReshuffledGame} from "./gameController.js";

let startingDeck = [];
let discardDeck = [];

export const getCards = async (req, res) => {

    try {
        const cardDeck = await Card.find();
        startingDeck = [...cardDeck];
        res.status(200).json(cardDeck);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
};

export const createCard = async (req, res) => {

    const card = req.body;
    const newCard = new Card({...card, creationDate: new Date().toISOString()});

    try {
        await newCard.save();
        res.status(201).json(newCard);
    } catch (error) {
        res.status(409).json({message: error.message});
    }
};

export const initDeck = async () => {

    try {
        const deck = await Card.find();
        startingDeck = [...deck].sort(() => Math.random() - 0.5);
        discardDeck = [];
        return startingDeck;
    } catch (error) {
        console.log(error.message);
    }
};

export const dealCards = (req, res) => {

    const {cards: cards2Deal} = req.params;

    const cards = drawCards(cards2Deal);

    try {
        updateDeck(cards);
        res.status(200).json(cards);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

const drawCards = (i) => {

    if (i > startingDeck.length) {
        const oldDeckDraw = [...startingDeck];
        // shuffleDeck();
        initDeck();
        const newDeckDraw = startingDeck.splice(0, i - oldDeckDraw.length);
        return oldDeckDraw.concat(newDeckDraw);
    }
    return startingDeck.splice(0, i);
}

export const updateDecksFromGame = (deck, discard) => {
    startingDeck = [...deck];
    discardDeck = [...discard];
}

export const shuffleDeck = () => {
    startingDeck = [...discardDeck].sort(() => Math.random() - 0.5);
    discardDeck = [];
    updateReshuffledGame(startingDeck);
}

export const discardCards = discardedCards => {
    discardDeck.push(card);
}