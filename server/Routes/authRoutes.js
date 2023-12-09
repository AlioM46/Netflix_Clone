const express = require("express");
const router = express.Router();
const {
  login,
  refreshToken,
  logout,
  register,
} = require("../controllers/authController");
const LoginLimiter = require("../middlewares/LoginLimiter.js");
router.use("/", LoginLimiter);

router.route("/").post(login).patch(logout);
router.route("/register").post(register);
router.get("/refresh", refreshToken);
module.exports = router;
