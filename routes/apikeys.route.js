const express = require("express");
const {
  generateNewApiKey,
  revokeApiKey,
  dropApiKey,
} = require("../controllers/apikeys.controller");
const {
  getTokenFromQuery,
  validateToken,
  getUserById,
} = require("../middlewares");

const router = express.Router();

router.post(
  "/new",
  getTokenFromQuery,
  validateToken,
  getUserById,
  generateNewApiKey
);
router.put(
  "/revoke/:token",
  getTokenFromQuery,
  validateToken,
  getUserById,
  revokeApiKey
);
router.delete(
  "/drop/:token",
  getTokenFromQuery,
  validateToken,
  getUserById,
  dropApiKey
);

module.exports = router;
