import mongoose, { Schema } from "mongoose";

const ConfirmationSchema = new mongoose.Schema({

  date: {
    type: Date,
    required: true,
  },

  hour: {
    type: Date,
    required: true,
  },

  ticket: {
    type: Schema.Types.ObjectId,
    ref: 'Ticket',
    required: true,
  }

});

export const ConfirmationModel = mongoose.model('Confirmation', ConfirmationSchema );