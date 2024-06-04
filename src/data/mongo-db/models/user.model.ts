import mongoose, { Schema } from "mongoose";

const UserSchema = new mongoose.Schema({

  name: {
    type: String,
    required: [ true, 'User name is required'],
    maxlength: 60,
  },

  email: {
    type: String,
    required: [true, 'User email is required'],
    unique: true,
  },
  
  google: {
    type: Boolean,
    default: false,
  },

  emailValidated: {
    type: Boolean,
    default: false,
  },

  password: {
    type: String,
    required: [true, 'User Password is required'],
    minlength: 8,
  },

  lastLogin: {
    type: String,
    required: [ true, 'Last login is required'],
  },

  createdAt: {
    type: String,
    required: [ true, 'CreatedAt is required'],
  },

  activateKey: {
    type: String
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  profile: {
    type: Schema.Types.ObjectId,
    ref: 'Profile',
    required: true,
  }

});

UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function ( _doc, ret, _options ) {
    delete ret._id;
    delete ret.password;
    delete ret.google;
    delete ret.activateKey;
  }
})

export const UserModel = mongoose.model('User', UserSchema );

