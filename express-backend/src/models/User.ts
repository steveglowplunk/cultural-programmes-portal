import mongoose, { Document, Model, model, Schema } from 'mongoose';

// const userSchema = new mongoose.Schema({
//     username: { type: String, unique: true, required: true },
//     password: { type: String, required: true },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//         validate: {
//             validator: function (email : string) {
//                 const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//                 return emailRegex.test(email);
//             },
//             message: 'Invalid email format'
//         }
//     },
//     favouriteLocation: [{ type: String }], // Field to store user's favourite venues with venueIds
//     role : { type: String, default: 'normal' },
//     _id : { type: String, default: '' },
//     __v : { type: Number, default: 0 }
// });

// export const User = mongoose.model('User', userSchema);


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