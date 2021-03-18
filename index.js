import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
// import playerRoutes from './routes/playerRoutes.js';
// import deckRoutes from './routes/deckRoutes.js';

const app = express();
dotenv.config();

app.use(cors());

// app.use('/player', playerRoutes);
// app.use('/deck', deckRoutes);

app.get('/', (req, res) => {
    res.send('Dixit starts here!')
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => app.listen(PORT, () => console.log(`Dixit Server running on port ${PORT}`)))
    .catch(err => console.log(err));

mongoose.set('useFindAndModify', false);