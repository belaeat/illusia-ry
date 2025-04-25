const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
  updateUserRole,
  getUserRole,
} = require("../controllers/auth.controllers");
const { verifyToken, checkRole } = require("../middleware/auth.middleware");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Get user role by email
router.get("/user-role/:email", getUserRole);

router.post(
  "/update-role",
  verifyToken,
  checkRole(["admin", "super-admin"]),
  updateUserRole
);

export default router;
