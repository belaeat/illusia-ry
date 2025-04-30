import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import itemRoutes from "./routes/item.routes";
import authRoutes from "./routes/auth.routes";
import bookingRequestRoutes from "./routes/bookingRequestRoutes";
import { checkRole, verifyToken } from "./middleware/auth.middleware";

// Import user routes using require
const userRoutes = require("./routes/user.routes");

dotenv.config();
connectDB();

const app = express();

// ✅ Proper CORS setup

app.use(
  cors({
    origin: "http://localhost:5173", // Reflects the request origin
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(cookieParser());

// ✅ API routes
app.use("/api/items", itemRoutes);
// If needed, secure the route like this:
// app.use('/api/items', verifyToken, checkRole(['user', 'admin']), itemRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/booking-requests", bookingRequestRoutes);

// ✅ Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
