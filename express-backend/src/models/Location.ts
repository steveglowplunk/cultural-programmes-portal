import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  venueId: { type: String, default: '' },
  venueName: { type: String, default: '' },
  latitude: { type: String, default: '' },
  longitude: { type: String, default: '' },
});

export const Location = mongoose.model('Location', locationSchema);