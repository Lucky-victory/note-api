const express = require("express");
const { createNewUser, loginUser } = require("../controllers/users.controller");
const router = express.Router();

router.post("/signUp", createNewUser);
router.post("/signIn", loginUser);

module.exports = router;
