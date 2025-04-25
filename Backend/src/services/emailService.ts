import nodemailer from "nodemailer";
import { IBookingRequest } from "../models/bookingRequest.model";
import { IItem } from "../models/item.model";

// Create a transporter using environment variables
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Define a type for the populated booking request
export interface PopulatedBookingRequest
  extends Omit<IBookingRequest, "items"> {
  items: Array<{
    item: IItem;
    quantity: number;
    startDate: Date;
    endDate: Date;
  }>;
}

/**
 * Send a booking approval email to the user
 * @param userEmail The email address of the user
 * @param bookingRequest The booking request that was approved
 */
export const sendBookingApprovalEmail = async (
  userEmail: string,
  bookingRequest: PopulatedBookingRequest
): Promise<void> => {
  try {
    // Format of the booking items for the email
    const itemsList = bookingRequest.items
      .map(
        (item) => `
      <li>
        <strong>${item.item.description}</strong><br>
        Quantity: ${item.quantity}<br>
        Start Date: ${new Date(item.startDate).toLocaleDateString()}<br>
        End Date: ${new Date(item.endDate).toLocaleDateString()}
      </li>
    `
      )
      .join("");

    // Create the email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Your Booking Request Has Been Approved",
      html: `
        <h1>Booking Request Approved</h1>
        <p>Dear User,</p>
        <p>Your booking request has been approved. Here are the details:</p>
        <p><strong>Booking ID:</strong> ${bookingRequest._id}</p>
        <p><strong>Request Date:</strong> ${new Date(
          bookingRequest.createdAt
        ).toLocaleDateString()}</p>
        <h2>Booked Items:</h2>
        <ul>${itemsList}</ul>
        <p>Thank you for using our service!</p>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log(`Approval email sent to ${userEmail}`);
  } catch (error) {
    console.error("Error sending approval email:", error);
  }
};
