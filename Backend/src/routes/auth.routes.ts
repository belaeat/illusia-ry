const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
  updateUserRole,
} = require("../controllers/auth.controllers");
const { verifyToken, checkRole } = require("../middleware/auth.middleware");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post(
  "/update-role",
  verifyToken,
  checkRole(["admin", "super-admin"]),
  updateUserRole
);

export default router;
