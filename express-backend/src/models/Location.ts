import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  venueId: {
    type: String,
    required: true,
    unique: true,
  },
  venueName: {
    type: String,
    required: true,
  },
  latitude: {
    type: String,
    required: true,
  },
  longitude: {
    type: String,
    required: true,
  },
});

export const Location = mongoose.model('Location', locationSchema);