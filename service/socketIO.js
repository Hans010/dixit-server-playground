import {Server} from 'socket.io';
import express from "express";
import * as http from "http";
import {addCardToPlay, submitStory} from "../controllers/roundController.js";

export const app = express();
export const server = http.createServer(app);
export const io = new Server().attach(server);

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('story submitted', story => {
        submitStory(story);
        io.emit('new story', story);
    })

    socket.on('card played', card => {
        const updatedCardsinPlay = addCardToPlay(card);
        io.emit('updated play', updatedCardsinPlay);
    })
});

