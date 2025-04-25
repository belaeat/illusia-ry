import express from "express";
import { verifyToken, checkRole } from "../middleware/auth.middleware";
import {
  createBookingRequest,
  getAllBookingRequests,
  getUserBookingRequests,
  updateBookingStatus,
  cancelBookingRequest,
} from "../controllers/bookingRequest.controller";

const router = express.Router();

console.log("Registering booking request routes");

router.post("/", verifyToken, createBookingRequest);
router.get("/", verifyToken, checkRole(["admin"]), getAllBookingRequests);
router.get("/admin", verifyToken, checkRole(["admin"]), getAllBookingRequests);
router.get("/my-requests", verifyToken, getUserBookingRequests);
router.patch(
  "/:id/status",
  verifyToken,
  checkRole(["admin"]),
  updateBookingStatus
);
router.delete("/:id/cancel", verifyToken, cancelBookingRequest);

export default router;
