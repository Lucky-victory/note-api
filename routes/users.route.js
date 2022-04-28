const express = require("express");
const { createNewUser } = require("../controllers/users.controller");
const router = express.Router();

router.post("/signUp", createNewUser);
router.post("/singIn", createNewUser);

module.exports = router;
