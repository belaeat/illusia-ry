import { Request, Response } from "express";
import BookingRequest from "../models/bookingRequest.model";
import { sendBookingApprovalEmail } from "../services/emailService";
import User from "../models/user.model";
import { PopulatedBookingRequest } from "../services/emailService";

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

    // Send email notification if the booking is approved
    if (status === "approved") {
      // Get the user's email
      const user = await User.findById(bookingRequest.user);
      if (user && user.email) {
        // Send the approval email
        await sendBookingApprovalEmail(
          user.email,
          bookingRequest as unknown as PopulatedBookingRequest
        );
      }
    }

    res.json(bookingRequest);
  } catch (error) {
    res.status(400).json({ message: "Error updating booking request" });
  }
};

// Cancel a booking request (user only)
export const cancelBookingRequest = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const bookingRequest = await BookingRequest.findById(req.params.id);

    if (!bookingRequest) {
      res.status(404).json({ message: "Booking request not found" });
      return;
    }

    // Check if the user is the owner of the booking request
    if (bookingRequest.user.toString() !== req.user.userId) {
      res.status(403).json({
        message: "You are not authorized to cancel this booking request",
      });
      return;
    }

    // Check if the booking request is still pending
    if (bookingRequest.status !== "pending") {
      res
        .status(400)
        .json({ message: "Only pending booking requests can be cancelled" });
      return;
    }

    // Delete the booking request
    await BookingRequest.findByIdAndDelete(req.params.id);

    res.json({ message: "Booking request cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling booking request:", error);
    res.status(500).json({ message: "Error cancelling booking request" });
  }
};

// Update booking request (user only)
export const updateBookingRequest = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const bookingRequest = await BookingRequest.findById(req.params.id);

    if (!bookingRequest) {
      res.status(404).json({ message: "Booking request not found" });
      return;
    }

    // Check if the user is the owner of the booking request
    if (bookingRequest.user.toString() !== req.user.userId) {
      res.status(403).json({
        message: "You are not authorized to update this booking request",
      });
      return;
    }

    // Check if the booking request is still pending
    if (bookingRequest.status !== "pending") {
      res
        .status(400)
        .json({ message: "Only pending booking requests can be updated" });
      return;
    }

    // Update the booking request
    const updatedBookingRequest = await BookingRequest.findByIdAndUpdate(
      req.params.id,
      { items: req.body.items },
      { new: true }
    )
      .populate("user", "-password")
      .populate("items.item");

    if (!updatedBookingRequest) {
      res.status(404).json({ message: "Booking request not found" });
      return;
    }

    res.json(updatedBookingRequest);
  } catch (error) {
    console.error("Error updating booking request:", error);
    res.status(500).json({ message: "Error updating booking request" });
  }
};
