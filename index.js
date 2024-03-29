import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import playerRoutes from './routes/playerRoutes.js';
import cardRoutes from "./routes/cardRoutes.js";
import gameRoutes from './routes/gameRoutes.js';
import {app, server, io} from "./service/socketIO.js";

dotenv.config();

app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());

app.use('/player', playerRoutes);
app.use('/game', gameRoutes);
app.use('/card', cardRoutes);

app.get('/', (req, res) => {
    res.send('Dixit starts here!')
});


const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => server.listen(PORT, () => console.log(`Dixit Server running on port ${PORT}`)))
    .catch(err => console.log(err));

mongoose.set('useFindAndModify', false);


