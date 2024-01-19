
import express from 'express'
import { addTicket, getTickets, updateTicket } from '../controllers/ticketControllers.js';

const ticketRoute = express.Router();

ticketRoute.post('/support-tickets', addTicket);
ticketRoute.get('/support-tickets', getTickets);
ticketRoute.patch('/support-tickets/:id', updateTicket);

export default ticketRoute;