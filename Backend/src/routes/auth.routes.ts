const express = require("express");
const router = express.Router();

const { register, login, logout } = require("../controllers/auth.controllers");


router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

export default  router;