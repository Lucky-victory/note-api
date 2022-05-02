const express = require("express");
const router = express.Router();
const {
  createNewNote,
  editNote,
  getNotesByUser,
  moveNoteToTrash,
  moveNoteFromTrash,
} = require("../controllers/notes.controllers");
const {
  getTokenFromQuery,
  validateToken,
  getUserById,
} = require("../middlewares");
const cors = require("cors");

router.get(
  "/",
  cors(),
  getTokenFromQuery,
  validateToken,
  getUserById,
  getNotesByUser
);
router.post(
  "/new",
  cors(),
  getTokenFromQuery,
  validateToken,
  getUserById,
  createNewNote
);
router.put(
  "/edit/:note_id",
  cors(),
  getTokenFromQuery,
  validateToken,
  getUserById,
  editNote
);
router.put(
  "/toTrash/:note_id",
  cors(),
  getTokenFromQuery,
  validateToken,
  getUserById,
  moveNoteToTrash
);
router.put(
  "/outOfTrash/:note_id",
  cors(),
  getTokenFromQuery,
  validateToken,
  getUserById,
  moveNoteFromTrash
);

module.exports = router;
