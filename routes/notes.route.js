const express = require("express");
const router = express.Router();
const { createNewNote, editNote } = require("../controllers/notes.controllers");
const { getTokenFromHeaderOrQuery } = require("../middlewares");

router.post("/new", getTokenFromHeaderOrQuery, createNewNote);
router.put("/edit/:note_id", getTokenFromHeaderOrQuery, editNote);
router.delete("/moveToTrash/:note_id", getTokenFromHeaderOrQuery);

module.exports = router;
