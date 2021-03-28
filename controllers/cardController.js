import Card from '../models/cardModel.js';
import {updateDeck, reshuffleDeck} from "./gameController.js";

let startingDeck = [];
let playedCards = [];

export const getCards = async (req, res) => {

    try {
        const cardDeck = await Card.find();
        startingDeck = [...cardDeck];
        res.status(200).json(cardDeck);
        console.log(startingDeck);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
};

export const initDeck = async () => {

    try {
        startingDeck = await Card.find();
        return [...startingDeck];
    } catch (error) {
        console.log(error.message);
    }
};

export const dealCards = (req, res) => {

    const {cards: cards2Deal} = req.params;

    const cards = drawCards(cards2Deal);

    try {
        const updatedGame = updateDeck(cards);

        res.status(200).json(cards);
        console.log('dealing cards');
        // console.log(cards);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}


export const createCard = async (req, res) => {

    const card = req.body;
    console.log(req.body);
    const newCard = new Card({...card, creationDate: new Date().toISOString()});

    try {
        await newCard.save();
        res.status(201).json(newCard);
    } catch (error) {
        res.status(409).json({message: error.message});
    }
};

const drawCards = (i) => {

    if (i > startingDeck.length) startingDeck = reshuffleDeck();
    return startingDeck.splice(0, i);
}


