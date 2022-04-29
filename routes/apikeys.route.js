const express = require("express");
const {
  generateNewApiKey,
  revokeApiKey,
  dropApiKey,
} = require("../controllers/apikeys.controller");
const { getTokenFromQuery, validateToken } = require("../middlewares");

const router = express.Router();

router.post("/generate", getTokenFromQuery, validateToken, generateNewApiKey);
router.put("/revoke/:token", getTokenFromQuery, validateToken, revokeApiKey);
router.delete("/drop/:token", getTokenFromQuery, validateToken, dropApiKey);

module.exports = router;
