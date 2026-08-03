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
    required: [true, 'Kids quantity is required'],
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
    required: [true, 'Ticket Phone is required'],
  },

  keyPass: {
    type: String,
    required: [true, 'Key Pass required'],
  },

  table: {
    type: String,
    default: "Por asignar",
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

export const TicketModel = mongoose.model('Ticket', TicketSchema);

// Eliminar el índice único antiguo 'phone_1' si existe en la base de datos de MongoDB
TicketModel.collection.dropIndex('phone_1').catch(() => {
  // El índice ya fue eliminado o no existe en MongoDB
});