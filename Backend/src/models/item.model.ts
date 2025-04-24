import mongoose from "mongoose";

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

const Item = mongoose.model("Item", itemSchema);
export default Item;
