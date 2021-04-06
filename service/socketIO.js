import {Server} from 'socket.io';
import express from "express";
import * as http from "http";
import {addCardToPlay, newRound, submitStory, voteInCard} from "../controllers/roundController.js";

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

    socket.on('card played', card => {
        const updatedCardsinPlay = addCardToPlay(card);
        sendUpdatedPlay(updatedCardsinPlay);
    })

    socket.on('round finished', () => {
        sendUpdatedPlay(newRound());
    })

    socket.on('card voted', cardVote => {
       if (voteInCard(cardVote)) io.emit('vote success')
        else io.emit('vote fail');
    })
});

const sendUpdatedPlay = (cards) => {
    io.emit('updated play', cards);
}
