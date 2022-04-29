const express = require("express");
const router = express.Router();
const { createNewNote, editNote } = require("../controllers/notes.controllers");
const { getTokenFromQuery, validateToken } = require("../middlewares");
const cors = require("cors");

router.post("/new", cors(), getTokenFromQuery, validateToken, createNewNote);
router.put(
  "/edit/:note_id",
  cors(),
  getTokenFromQuery,
  validateToken,
  editNote
);
router.delete("/toTrash/:note_id", cors(), getTokenFromQuery, validateToken);

module.exports = router;
