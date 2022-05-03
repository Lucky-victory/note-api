const express = require("express");
const {
  getNotesInTrash,
  deleteNotesInTrash,
} = require("../controllers/trash.controller");
const {
  getTokenFromQuery,
  validateToken,
  getUserById,
} = require("../middlewares");

const router = express.Router();
const cors = require("cors");
router.get(
  "/",
  cors(),
  getTokenFromQuery,
  validateToken,
  getUserById,
  getNotesInTrash
);
router.delete(
  "/:note_id",
  cors(),
  getTokenFromQuery,
  validateToken,
  getUserById,
  deleteNotesInTrash
);

module.exports = router;
