const express = require("express");
const router = express.Router();
const {
  createUser,
  getUsers,
  patchUser,
  deleteUser,
} = require("../controllers/usersController");

router.route("/").get(getUsers).patch(patchUser);

router.delete("/:userId", deleteUser);
module.exports = router;
