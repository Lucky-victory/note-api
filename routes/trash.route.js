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

router.get("/", getTokenFromQuery, validateToken, getUserById, getNotesInTrash);
router.delete(
  "/:note_id",
  getTokenFromQuery,
  validateToken,
  getUserById,
  deleteNotesInTrash
);

module.exports = router;
