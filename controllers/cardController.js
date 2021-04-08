import Card from '../models/cardModel.js';
import {gameId} from "./gameController.js";
import Game from "../models/gameModel.js";

export const getCards = async (req, res) => {

    try {
        const cardDeck = await Card.find();
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
        return [...deck].sort(() => Math.random() - 0.5);
    } catch (error) {
        console.log(error.message);
    }
};

export const dealCards = async (req, res) => {

    const {cards: cards2Deal} = req.params;

    const cards = await drawCards(cards2Deal);

    try {
        res.status(200).json(cards);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

const drawCards = async (i) => {
    console.log('drawing cards');
    let game = await Game.findById(gameId);
    let startingDeck = game.deck;
    let cards = [];

    if (i > startingDeck.length) {
        const oldDeckDraw = [...startingDeck];
        startingDeck = await initDeck();
        const newDeckDraw = startingDeck.splice(0, i - oldDeckDraw.length);
        await Game.findByIdAndUpdate(gameId, {deck: [...startingDeck], discard: []})
        return oldDeckDraw.concat(newDeckDraw);
    } else {
        console.log(' dealing ', i, ' cards');
        cards = startingDeck.splice(0, i);
        const gam = await Game.findByIdAndUpdate(gameId, {
            deck: [...startingDeck],
        }, {new: true});
        console.log('updated game ', gam.deck.length);
        return cards;
    }
}

export const discardCards = async discardedCards => {


}