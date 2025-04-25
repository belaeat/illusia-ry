import mongoose, { Document } from "mongoose";

export interface IItem extends Document {
  description: string;
  contentSummary: string;
  storageDetails: string;
  storageLocation?: string;
  isAvailable: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const itemSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    contentSummary: { type: String, required: true },
    storageDetails: { type: String, required: true },
    storageLocation: { type: String }, // optional, make it required if needed
    isAvailable: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IItem>("Item", itemSchema);
