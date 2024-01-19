
import express from 'express'
import { createAgent, updateAgentStatus, getAgents } from '../controllers/agentControllers.js';

const agentRoute = express.Router();

agentRoute.post('/support-agents', createAgent);
agentRoute.get('/support-agents/', getAgents)
agentRoute.patch('/support-agents/:id', updateAgentStatus);

export default agentRoute;