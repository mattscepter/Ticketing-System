import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongo from './config/mongo.js'
import agentRoute from './route/agentRoute.js';
import ticketRoute from './route/ticketRoute.js';
//mongo connection func call
await mongo();

//dotenv config
dotenv.config();
const app = express();

//middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cors());

//routes
app.use('/api', agentRoute);
app.use('/api', ticketRoute);

//server
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`, 'SERVER');
});
