import { Request, Response } from "express";
import User from "../models/user.model";
import { getAuth } from "firebase-admin/auth";

// Get all users
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Get all users from MongoDB
    const users = await User.find().select("-password");

    // Get Firebase users to match with MongoDB users
    const auth = getAuth();
    const firebaseUsers = await auth.listUsers();

    // Map Firebase UIDs to MongoDB users
    const usersWithFirebaseInfo = users.map((user) => {
      const firebaseUser = firebaseUsers.users.find(
        (fu) => fu.email === user.email
      );
      return {
        ...user.toObject(),
        firebaseUid: firebaseUser?.uid || null,
      };
    });

    res.status(200).json({
      success: true,
      users: usersWithFirebaseInfo,
    });
  } catch (err: any) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete user
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.params;
    console.log("Attempting to delete user with email:", email);

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found with email:", email);
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    console.log("Found user:", user.email);

    // Delete from MongoDB
    const deleteResult = await User.findOneAndDelete({ email });
    console.log("MongoDB delete result:", deleteResult);

    // Delete from Firebase
    try {
      const auth = getAuth();
      const firebaseUser = await auth.getUserByEmail(email);
      if (firebaseUser) {
        await auth.deleteUser(firebaseUser.uid);
        console.log("Firebase user deleted successfully");
      }
    } catch (firebaseErr) {
      console.error("Error deleting Firebase user:", firebaseErr);
      // Continue even if Firebase deletion fails
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err: any) {
    console.error("Error deleting user:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};
