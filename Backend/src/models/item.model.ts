import mongoose, { Document, Schema } from 'mongoose';

export interface IItem extends Document {
  name: string;
  description?: string;
  location?: string;
  isAvailable: boolean;
  createdAt: Date;
}

const ItemSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  location: { type: String },
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IItem>('Item', ItemSchema);
