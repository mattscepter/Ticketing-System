import dayjs from "dayjs";
import Agent from "../models/agent.js";
import utc from "dayjs/plugin/utc.js"

dayjs.extend(utc);

// This is the controller for creating a new agent
export const createAgent = async (req, res) => {
    const { name, email, phone, description, active } = req.body;

    // Check if all the details are provided
    if (!name || !email || !phone || !description || !active) {
        return res.status(400).json({ message: "Please provide all the details" });
    }

    // Create a new agent
    const agent = new Agent({ name, email, phone, description, active, dateCreated: dayjs().utcOffset(330).format() });

    // Save the agent to the database
    try {
        const response = await agent.save();
        res.status(201).json({ message: "Agent added successfully", agent: response });
    } catch (err) {
        res.status(400).json({ message: "Something went wrong" });
    }
}

// This is the controller for getting all the agents
export const getAgents = async (req, res) => {
    try {
        // Check if the query parameter active is true
        const { active } = req.query;

        // If active is true, return only active agents
        if (active === 'true') {
            const response = await Agent.find({ active: true });
            res.status(200).json({ agents: response });
        } else {
            const response = await Agent.find({});
            res.status(200).json({ agents: response });
        }
    } catch (err) {
        res.status(400).json({ message: "Something went wrong" });
    }
}

// This is the controller for updating the status of an agent
export const updateAgentStatus = async (req, res) => {

    // Check if the id and activeStatus is provided
    const { id } = req.params;
    const { activeStatus } = req.body;

    // If not, return error
    try {
        const response = await Agent.findByIdAndUpdate(id, { active: activeStatus }, { new: true });
        res.status(200).json({ message: "Agent deactivated successfully", agent: response });
    } catch (err) {
        res.status(400).json({ message: "Something went wrong" });
    }
}

