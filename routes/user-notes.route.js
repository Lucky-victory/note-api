const express = require("express");
const { getNotesByUser } = require("../controllers/notes.controllers");
const { getTokenFromHeaderOrQuery } = require("../middlewares");
const router = express.Router();

router.get("/", getTokenFromHeaderOrQuery, getNotesByUser);

module.exports = router;
