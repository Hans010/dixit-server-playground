import Card from '../models/cardModel.js';
import {gameId} from "./gameController.js";
import Game from "../models/gameModel.js";
import Round from "../models/roundModel.js";

let roundCards = [];
let initialRound = true;

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

    if (roundCards.length === 0) {
        await getRoundCards();
    }

    return roundCards.splice(0, i);
}

export const getRoundCards = async () => {
    const {players, deck} = await Game.findById(gameId);
    if (initialRound) {
        roundCards = deck.splice(0, (6 * players.length));
        initialRound = false;
    } else {
        const necessaryCards = players.length;
        if (deck.length < necessaryCards) {
            roundCards = [...deck];

            let newDeck = await initDeck();

            roundCards.concat(newDeck.splice(0, (necessaryCards - roundCards.length)));

            await Game.findByIdAndUpdate(gameId, {
                deck: [...newDeck],
                discard: [],
                lastModified: Date.now()
            }, {new: true})
        } else {
            roundCards = deck.splice(0, players.length);
        }
    }
    await Game.findByIdAndUpdate(gameId, {deck: [...deck]});
}