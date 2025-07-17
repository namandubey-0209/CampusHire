import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  forgotPassCode?: string;
  forgotPassCodeExpiry?: Date;
  role: "student" | "admin";
}

const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    forgotPassCode: {
      type: String,
    },
    forgotPassCodeExpiry: {
      type: Date,
    },
    role: {
      type: String,
      enum: ["student", "admin"], 
      required: true,
    },
  },
  { timestamps: true }
);

const User =
  (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);

export default User;
