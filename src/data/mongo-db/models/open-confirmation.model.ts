import mongoose, { Schema } from "mongoose";

const OpenConfirmationSchema = new mongoose.Schema({

  firstName: {
    type: String,
    required: [true, 'First name is required'],
  },

  lastName: {
    type: String,
    required: [true, 'Last name is required'],
  },

  phone: {
    type: String,
    required: [true, 'Phone number is required'],
  },

  adultsQuantity: {
    type: Number,
    required: [true, 'Adults quantity is required'],
    default: 1,
  },

  kidsQuantity: {
    type: Number,
    required: [true, 'Kids quantity is required'],
    default: 0,
  },

  willAttend: {
    type: Boolean,
    required: [true, 'willAttend is required'],
    default: true,
  },

  registrationDate: {
    type: Date,
    default: Date.now,
  },

  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event is required'],
  },

});

export const OpenConfirmationModel = mongoose.model('OpenConfirmation', OpenConfirmationSchema);
