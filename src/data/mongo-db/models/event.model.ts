import mongoose, { Schema } from "mongoose";

const EventSchema = new mongoose.Schema({

  name: {
    type: String,
    required: [ true, 'Event name is required'],
  },

  description: {
    type: String,
    default: 'Evento de [] destinado para [] con una afluencia de []. Se realizará en [].'
  },

  client: {
    type: String,
  },

  isActive: {
    type: Boolean,
    default: true
  },

  eventType: {
    type: String,
    required: [true, 'Event Type is required'],
    enum: ['graduación', 'boda', 'posada', 'xv', 'coffee talks', 'otro'],
    default: 'graduación',
  },

  eventDate: {
    type: String,
    required: [true, 'Event Date is required'],
  },

  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  image: {
    type: String,
  }

});

export const EventModel = mongoose.model('Event', EventSchema ); 