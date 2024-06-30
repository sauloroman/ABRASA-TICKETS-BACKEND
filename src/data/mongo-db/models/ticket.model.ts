import mongoose, { Schema } from "mongoose";

const TicketSchema = new mongoose.Schema({

  name: {
    type: String,
    required: [true, 'Ticket name is required'],
  },

  adultsQuantity: {
    type: Number,
    required: [true, 'Adults quantity is required'],
  },

  kidsQuantity: {
    type: Number,
    required: [ true, 'Kids quantity is required'],
  },

  adultsCounter: {
    type: Number,
    default: 0,
  },

  kidsCounter: {
    type: Number,
    default: 0,
  },

  qrCode: {
    type: String,
  },

  phone: {
    type: String,
    required: [ true, 'Ticket Phone is required'],
    unique: true,
  },

  keyPass: {
    type: String,
    required: [ true, 'Key Pass required'],
  },

  table: {
    type: Number,
  },

  isActive: {
    type: Boolean,
    default: true,
  },
  
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }

});

export const TicketModel = mongoose.model('Ticket', TicketSchema );