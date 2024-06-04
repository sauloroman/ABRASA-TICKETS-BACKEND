import mongoose, { Schema } from "mongoose";

const ProfileSchema = new mongoose.Schema({

  image: {
    type: String,
  },

  coverImage: {
    type: String,
  },

  bio: {
    type: String,
    maxlength: 220,
  },

  phone: {
    type: String,
    maxlength: 10,
  },

  facebook: {
    type: String,
  },

  instagram: {
    type: String,
  },

  tiktok: {
    type: String,
  },

  website: {
    type: String,
  },

  location: {
    type: String,
  },

  address: {
    type: String,
  },

  profession: {
    type: String,
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }

});

export const ProfileModel = mongoose.model('Profile', ProfileSchema );