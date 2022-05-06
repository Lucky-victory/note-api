const express = require("express");
const { createNewUser, loginUser } = require("../controllers/users.controller");
const router = express.Router();
const cors = require("cors");

router.post("/sign-up", cors(), createNewUser);
router.post("/sign-in", cors(), loginUser);

module.exports = router;
