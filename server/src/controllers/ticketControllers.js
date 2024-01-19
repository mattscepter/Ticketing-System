import Ticket from "../models/ticket.js";
import Agent from "../models/agent.js";
import utc from "dayjs/plugin/utc.js"
import dayjs from "dayjs";
import mongoose from "mongoose";

dayjs.extend(utc);

// This is the controller for creating a new ticket
let lastAssignedAgentIndex = 0;

// This is the controller for creating a new ticket
export const addTicket = async (req, res) => {
    const { topic, severity, type, description, status } = req.body;

    // Check if all the details are provided
    if (!topic || !severity || !type || !description || !status) {
        return res.status(400).json({ message: "Please provide all the details" });
    }
    // Find all active support agents
    const activeAgents = await Agent.find({ active: true });

    // If no active support agent is found, return error
    if (!activeAgents.length) {
        return res.status(400).json({ message: "No active support agent found" });
    }

    // Assign ticket to the next active support agent
    const assignedTo = activeAgents[lastAssignedAgentIndex]._id;
    lastAssignedAgentIndex = (lastAssignedAgentIndex + 1) % activeAgents.length;

    // Create a new ticket
    const ticket = new Ticket({ topic, severity, type, description, status: "Assigned", assignedTo, dateCreated: dayjs().utcOffset(330).format() });

    // Save the ticket to the database
    try {
        const response = await ticket.save();
        res.status(201).json({ message: "Ticket added successfully", ticket: response });
    } catch (err) {
        console.log(err)
        res.status(400).json({ message: "Something went wrong" });
    }
}

// This is the controller for updating a ticket
export const updateTicket = async (req, res) => {

    // Fetch the id from the request parameters
    const { id } = req.params;

    // Fetch the details from the request body
    const { topic, severity, type, description, status } = req.body;

    // Check if all the details are provided
    if (!status) {
        return res.status(400).json({ message: "Please status" });
    }

    try {
        // If status is resolved, update the resolvedOn field
        if (status === 'Resolved') {
            const ticket = await Ticket.findById(id);
            // If ticket is already resolved, return error
            if (ticket.status === 'Resolved') {
                return res.status(400).json({ message: "Ticket is already resolved" });
            }
            // Update the ticket
            const response = await Ticket.findByIdAndUpdate(id, { topic, severity, type, description, resolvedOn: dayjs().utcOffset(330).format(), status }, { new: true });
            res.status(200).json({ message: "Ticket updated successfully", ticket: response });
        } else {
            const response = await Ticket.findByIdAndUpdate(id, { topic, severity, type, resolvedOn: null, description, status }, { new: true });
            res.status(200).json({ message: "Ticket updated successfully", ticket: response });
        }
    } catch (err) {
        res.status(400).json({ message: "Something went wrong" });
    }
}

// This is the controller for getting all the tickets
export const getTickets = async (req, res) => {

    // Fetch the query parameters
    const { page = 1, limit = 10, sortBy, sortOrder, status, type, assignedTo, severity, } = req.query;

    // Calculate the skip
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Ticket.countDocuments();

    const aggregateQuery = []
    const match = []
    // Check if the query parameters are provided and add them to the aggregate query
    if (status) {
        match.push({ status: status })
    }
    if (assignedTo) {
        match.push({ assignedTo: new mongoose.Types.ObjectId(assignedTo) })
    }
    if (severity) {
        match.push({ severity: severity })
    }
    if (type) {
        match.push({ type: type })
    }

    if (match.length > 0) {
        aggregateQuery.push({
            $match: {
                $and: match
            }
        })
    }

    // Add the sort query to the aggregate query
    if (sortBy && (sortBy === 'resolvedOn' || sortBy === 'dateCreated')) {
        aggregateQuery.push({
            $sort: {
                [sortBy]: parseInt(sortOrder)
            }
        })
    }

    // Add the count query to the aggregate query
    const count = await Ticket.aggregate(aggregateQuery.concat([
        {
            $count: 'count'
        }
    ]))

    // Add the skip and limit query to the aggregate query
    aggregateQuery.push({
        $skip: skip
    })

    aggregateQuery.push({
        $limit: parseInt(limit)
    })

    // Fetch all the tickets
    const tickets = await Ticket.aggregate(aggregateQuery);

    // Populate the assignedTo field
    await Ticket.populate(tickets, { path: "assignedTo", select: "name" });

    res.status(200).json({ message: "Tickets fetched successfully", tickets, total, count: count.length ? count[0].count : 0, currentPage: page });
}