import mongoose, { Schema, Document, Types } from "mongoose";

export interface IJob extends Document {
  _id: Types.ObjectId;
  title: string;
  companyName: string;
  postedBy: Types.ObjectId;
  description: string;
  location: string;
  mode: "onsite" | "remote" | "hybrid";
  minCGPA: number;
  eligibleBranches: string[];
  lastDateToApply: Date;
  createdAt: Date;
}

const JobSchema: Schema<IJob> = new Schema(
  {
    title: { type: String, required: true },
    companyName: { type: String, required: true },
    postedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    mode: { type: String, enum: ["onsite", "remote", "hybrid"], required: true },
    minCGPA: { type: Number, required: true },
    eligibleBranches: [{ type: String }],
    lastDateToApply: { type: Date, required: true },
  },
  { timestamps: true }
);

const Job = mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema);
export default Job;