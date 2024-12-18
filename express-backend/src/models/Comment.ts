import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  user: mongoose.Types.ObjectId;
  location: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
}

const CommentSchema: Schema = new Schema({
  user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  location: { type: mongoose.Types.ObjectId, ref: 'Location', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Comment = mongoose.model<IComment>('Comment', CommentSchema);