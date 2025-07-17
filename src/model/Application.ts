import mongoose, { Schema, Document, Types } from "mongoose";

export interface IApplication extends Document {
  _id: Types.ObjectId;
  jobId: Types.ObjectId;
  studentId: Types.ObjectId;
  status: "applied" | "shortlisted" | "rejected";
  appliedAt: Date;
}

const ApplicationSchema: Schema<IApplication> = new Schema(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    studentId: { type: Schema.Types.ObjectId, ref: "StudentProfile", required: true },
    status: {
      type: String,
      enum: ["applied", "shortlisted", "rejected"],
      default: "applied",
    },
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Application =
  mongoose.models.Application ||
  mongoose.model<IApplication>("Application", ApplicationSchema);
export default Application;