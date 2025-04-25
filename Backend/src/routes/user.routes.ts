const express = require("express");
const router = express.Router();

const { getAllUsers, deleteUser } = require("../controllers/user.controllers");
const { verifyToken, checkRole } = require("../middleware/auth.middleware");

// Get all users - protected route for admins only
router.get("/", verifyToken, checkRole(["admin", "super-admin"]), getAllUsers);

// Delete user - protected route for admins only
router.delete(
  "/:email",
  verifyToken,
  checkRole(["admin", "super-admin"]),
  deleteUser
);

module.exports = router;
