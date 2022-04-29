const express = require("express");
const { createNewUser, loginUser } = require("../controllers/users.controller");
const router = express.Router();
const cors = require("cors");

router.post("/signUp", cors(), createNewUser);
router.post("/signIn", cors(), loginUser);

module.exports = router;
