import { Document, Model, model, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;

  email: string;

  password: string;

  favouriteVenues: string[];

  role: string;
}

const UserSchema: Schema<IUser> = new Schema({
  username: { type: String, required: true },

  email: { type: String, required: true, unique: true },

  password: { type: String, required: true },

  favouriteVenues: { type: [String], default: [] },
  role: {
    type: String,
    required: true,
    enum: ["normal", "admin"],
    default: "normal",
  },
});

export const User: Model<IUser> = model<IUser>("User", UserSchema);
