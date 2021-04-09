import {Server} from 'socket.io';
import express from "express";
import * as http from "http";
import {addCardToPlay, newRound, submitStory, voteInCard} from "../controllers/roundController.js";
import {playerReady2Play} from "../controllers/gameController.js";

export const app = express();
export const server = http.createServer(app);
export const io = new Server().attach(server);

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('story submitted', story => {
        submitStory(story);
        io.emit('new story', story);
    })

    socket.on('card played', async card => {
        const updatedCardsinPlay = await addCardToPlay(card);
        sendUpdatedPlay(updatedCardsinPlay);
    })

    socket.on('round finished', () => {
        sendUpdatedPlay(newRound());
    })

    socket.on('card voted', cardVote => {
        if (voteInCard(cardVote)) io.emit('vote success')
        else io.emit('vote fail');
    })

    socket.on('new round', async () => {
        const storyTellerId = await newRound();
        sendNewStoryTeller(storyTellerId);
    })

    socket.on('player ready2Play', async (playerId) => {
        const letsPlay = await playerReady2Play(playerId);
        if (letsPlay) io.emit('lets play');
    })

});

const sendUpdatedPlay = (cards) => {
    io.emit('updated play', cards);
}

const sendNewStoryTeller = (playerId) => {
    io.emit('new storyTeller', playerId);
}

