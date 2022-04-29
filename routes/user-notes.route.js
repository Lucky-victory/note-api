const express = require("express");
const { getNotesByUser } = require("../controllers/notes.controllers");
const { getTokenFromQuery, validateToken } = require("../middlewares");
const router = express.Router();
const cors = require("cors");

router.get("/",cors(), getTokenFromQuery,validateToken, getNotesByUser);

module.exports = router;
