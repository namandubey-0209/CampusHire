import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICompanyProfile extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  website: string;
  location: string;
  logoUrl: string;
}

const CompanyProfileSchema: Schema<ICompanyProfile> = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    website: { type: String, required: true },
    location: { type: String, required: true },
    logoUrl: { type: String, required: true },
  },
  { timestamps: true }
);

const CompanyProfile =
  mongoose.models.CompanyProfile ||
  mongoose.model<ICompanyProfile>("CompanyProfile", CompanyProfileSchema);
export default CompanyProfile;