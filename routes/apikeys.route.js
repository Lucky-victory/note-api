const express = require("express");
const {
  generateNewApiKey,
  revokeApiKey,
  dropApiKey,
} = require("../controllers/apikey.controller");
const { getTokenFromHeaderOrQuery } = require("../middlewares");

const router = express.Router();

router.post("/generate", getTokenFromHeaderOrQuery, generateNewApiKey);
router.post("/revoke", getTokenFromHeaderOrQuery, revokeApiKey);
router.delete("/drop/:token", getTokenFromHeaderOrQuery, dropApiKey);

module.exports = router;
