const express = require("express");
const router = express.Router();
const { createNewNote } = require("../controllers/notes.controllers");

router.post("/new", createNewNote);
router.put("/edit/:note_id");
router.delete("/moveToTrash/:note_id");

module.exports = router;
