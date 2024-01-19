import mongoose, { Schema } from "mongoose";

// Create the ticket schema
const ticketSchema = new Schema(
  {
    topic: {
      type: String,
      default: '',
    },
    severity: {
      type: String,
      enum: ['Low', 'Moderate', 'High'],
      default: 'Low',
    },
    type: {
      type: String,
      enum: ['Tech', 'Sales', 'Operations'],
      default: '',
    },
    status: { type: String, enum: ['New', 'Assigned', 'Resolved'], default: 'New' },
    description: {
      type: String,
      default: '',
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'agent',
      default: null,
    },
    dateCreated: {
      type: Date,
      default: Date.now,
    },
    resolvedOn: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.model('ticket', ticketSchema);