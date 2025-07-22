import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string; // Make optional for OAuth users
  forgotPassCode?: string;
  forgotPassCodeExpiry?: Date;
  role: "student" | "admin";
  provider?: string; // "credentials", "google", "github"
  providerId?: string; // OAuth provider's user ID
}

const UserSchema: Schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false }, // Optional for OAuth
    forgotPassCode: { type: String },
    forgotPassCodeExpiry: { type: Date },
    role: {
      type: String,
      enum: ["student", "admin"],
      required: true,
    },
    provider: { type: String },
    providerId: { type: String },
  },
  { timestamps: true }
);

const User =
  (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);

export default User;
