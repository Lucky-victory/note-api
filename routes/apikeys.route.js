const express = require("express");
const { createNewUser } = require("../controllers/users.controller");
const router = express.Router();

router.post("/generate", createNewUser);
router.delete("/drop/:token", createNewUser);

module.exports = router;
