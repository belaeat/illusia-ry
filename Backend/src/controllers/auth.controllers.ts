import { Request, Response } from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user.model";
import { getAuth } from "firebase-admin/auth";
import { initializeApp, cert } from "firebase-admin/app";

dotenv.config();

// Initialize Firebase Admin with environment variables
const firebaseConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
};

// Initialize Firebase Admin only if not already initialized
try {
  initializeApp(firebaseConfig);
  console.log("Firebase Admin initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase Admin:", error);
}

// Function to update Firebase user claims
const updateFirebaseUserRole = async (email: string, role: string) => {
  try {
    const auth = getAuth();
    const user = await auth.getUserByEmail(email);
    await auth.setCustomUserClaims(user.uid, { role });
    return true;
  } catch (error) {
    console.error("Error updating Firebase user claims:", error);
    return false;
  }
};

// Register User
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role, phone, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "User already exists",
      });
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user (typecast role if needed)
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      role,
    } as Partial<IUser>);

    await newUser.save();

    // Update Firebase user claims
    await updateFirebaseUserRole(email, role || "user");

    // Generate JWT
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    // Set the token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err: any) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Login User
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    // Update Firebase user claims on login
    await updateFirebaseUserRole(email, user.role);

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err: any) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update User Role
export const updateUserRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, role } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.role = role;
    await user.save();

    // Update Firebase user claims
    await updateFirebaseUserRole(user.email, role);

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err: any) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Logout User
export const logout = (req: Request, res: Response): void => {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({
      success: false,
      message: "User already logged out or not logged in",
    });
    return;
  }

  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};
