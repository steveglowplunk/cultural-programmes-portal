import mongoose from 'mongoose';
import { number } from 'zod';

const eventSchema = new mongoose.Schema({
  eventId: { type: String, default: '' },
  titleE: { type: String, default: '' },
  cat1: { type: String, default: '' },
  cat2: { type: String, default: '' },
  predateE: { type: String, default: '' },
  progtimeE: { type: String, default: '' },
  venueId: { type: String, default: '' },
  ageLimitE: { type: String, default: '' },
  priceE: { type: String, default: '' },
  descE: { type: String, default: '' },
  urlE: { type: String, default: '' },
  tagentUrlE: { type: String, default: '' },
  remarkE: { type: String, default: '' },
  enquiry: { type: String, default: '' },
  saleDate: { type: String, default: '' },
  interBook: { type: String, default: '' },
  presenterOrgE: { type: String, default: '' },
  progImage: { type: String, default: '' },
  detailImage1: { type: String, default: '' },
  detailImage2: { type: String, default: '' },
  detailImage3: { type: String, default: '' },
  detailImage4: { type: String, default: '' },
  detailImage5: { type: String, default: '' },
  videoLink: { type: String, default: '' },
  video2Link: { type: String, default: '' },
  submitDate: { type: String, default: '' },
  likeCount: { type: Number, default: 0 },
});

export const Event = mongoose.model('Event', eventSchema);