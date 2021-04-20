import {Server} from 'socket.io';
import express from "express";
import * as http from "http";
import {addCardToPlay, newRound, submitStory, voteInCard, resolveVotes} from "../controllers/roundController.js";
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

    socket.on('card voted', async cardVote => {
        const voteStatus = await voteInCard(cardVote);
        console.log(voteStatus);
        if (voteStatus) {
            io.emit('vote success')
            if (voteStatus.allVotes) {
                const results = await resolveVotes();
                // console.log(results);
                sendUpdatedScores(results);
                const storyTellerId = await newRound();
                startNewRound(storyTellerId);
            }
        } else io.emit('vote fail');
    })

    socket.on('new round', async () => {
        const storyTellerId = await newRound();
        startNewRound(storyTellerId);
    })

    socket.on('player ready2Play', async (playerId) => {
        const letsPlay = await playerReady2Play(playerId);
        if (letsPlay) {
            io.emit('lets play');
            const storyTellerId = await newRound();
            startNewRound(storyTellerId);
        }
    })

});

const sendUpdatedPlay = (cards) => {
    io.emit('updated play', cards);
}

const startNewRound = (playerId) => {
    io.emit('new storyTeller', playerId);
    io.emit('start new round');
}

const sendUpdatedScores = (scores) => {
    io.emit('updated scores', scores);
}
