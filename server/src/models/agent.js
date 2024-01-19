import mongoose, { Schema } from "mongoose";

// Create the agent schema
const agentSchema = new Schema(
  {
    name: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    active: {
      type: Boolean,
      default: false,
    },
    dateCreated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export default mongoose.model('agent', agentSchema);