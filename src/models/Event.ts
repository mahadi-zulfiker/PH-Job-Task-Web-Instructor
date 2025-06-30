// src/models/Event.ts
import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User'; // Import user interface if needed for population

export interface IEvent extends Document {
  title: string;
  postedBy: mongoose.Types.ObjectId | IUser; // Can be ObjectId or populated User object
  postedByName: string;
  date: Date;
  time: string;
  location: string;
  description: string;
  attendeeCount: number;
  attendees: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  postedByName: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  attendeeCount: {
    type: Number,
    default: 0,
  },
  attendees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  ]
}, { timestamps: true });

const Event = mongoose.models.Event || mongoose.model<IEvent>('Event', eventSchema);
export default Event;