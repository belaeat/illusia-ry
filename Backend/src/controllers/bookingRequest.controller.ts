import { Request, Response } from "express";
import BookingRequest from "../models/bookingRequest.model";

interface CustomRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

// Create a new booking request
export const createBookingRequest = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  console.log("Received booking request:", req.body);
  try {
    if (!req.user?.userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const bookingRequest = new BookingRequest({
      ...req.body,
      user: req.user.userId,
    });

    await bookingRequest.save();
    await bookingRequest.populate("items.item");

    res.status(201).json(bookingRequest);
  } catch (error) {
    console.error("Error creating booking request:", error);
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "Error creating booking request" });
    }
  }
};

// Get all booking requests (admin only)
export const getAllBookingRequests = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const bookingRequests = await BookingRequest.find()
      .populate("user", "-password")
      .populate("items.item")
      .sort({ createdAt: -1 });
    res.json(bookingRequests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching booking requests" });
  }
};

// Get user's booking requests
export const getUserBookingRequests = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const bookingRequests = await BookingRequest.find({
      user: req.user.userId,
    })
      .populate("items.item")
      .sort({ createdAt: -1 });
    res.json(bookingRequests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching booking requests" });
  }
};

// Update booking request status (admin only)
export const updateBookingStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      res.status(400).json({ message: "Invalid status" });
      return;
    }

    const bookingRequest = await BookingRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("user", "-password")
      .populate("items.item");

    if (!bookingRequest) {
      res.status(404).json({ message: "Booking request not found" });
      return;
    }

    res.json(bookingRequest);
  } catch (error) {
    res.status(400).json({ message: "Error updating booking request" });
  }
};
