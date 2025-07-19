import mongoose, { Schema, Document, Types } from "mongoose";

export interface IStudentProfile extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  email?: string; // to be considered
  enrollmentNo: string;
  branch: string;
  year: number;
  cgpa: number;
  resumeUrl: string;    // to be considered
  skills: string[];      // might have to add a set of tech skills
  isPlaced: boolean;
}

const StudentProfileSchema: Schema<IStudentProfile> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    email: { type: String, required: false },
    enrollmentNo: { type: String, required: true },
    branch: { type: String, required: true },
    year: { type: Number, required: true },
    cgpa: { type: Number, required: true },
    resumeUrl: { type: String, required: false },   // allow empty on create
    skills: [{ type: String }],
    isPlaced: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const StudentProfile =
  mongoose.models.StudentProfile ||
  mongoose.model<IStudentProfile>("StudentProfile", StudentProfileSchema);
export default StudentProfile;