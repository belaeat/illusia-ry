import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./user.model";
import { IItem } from "./item.model";

export interface IBookingItem {
  item: Schema.Types.ObjectId;
  quantity: number;
  startDate: Date;
  endDate: Date;
}

export interface IBookingRequest extends Document {
  user: Schema.Types.ObjectId;
  items: IBookingItem[];
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const bookingRequestSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        item: {
          type: Schema.Types.ObjectId,
          ref: "Item",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        startDate: {
          type: Date,
          required: true,
        },
        endDate: {
          type: Date,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Add validation for dates
bookingRequestSchema.pre("save", function (next) {
  this.items.forEach((item) => {
    if (item.startDate >= item.endDate) {
      next(new Error("End date must be after start date"));
    }
  });
  next();
});

export default mongoose.model<IBookingRequest>(
  "BookingRequest",
  bookingRequestSchema
);
