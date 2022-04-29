const { createNewApiKey } = require("../helpers");
const ApiKeys = require("../models/apikeys.model");

const generateNewApiKey = async (req, res) => {
  try {
    const { userKey } = req;
    const { apikey } = await createNewApiKey(userKey.userId);
    res.status(200).json({
      message: "successfully generated new apikey",
      apikey,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: "an error occurred",
    });
  }
};
const revokeApiKey = async (req, res) => {
  try {
    const { userKey } = req;

    await ApiKeys.update([
      {
        id: userKey.id,
        revoked: true,
      },
    ]);
    res.status(200).json({
      message: "key successfully revoked ",
    });
  } catch (error) {
    res.status(500).json({
      message: "an error occurred",
      error,
    });
  }
};
const dropApiKey = async (req, res) => {
  try {
    const keyToDrop = req.params.token;

    await ApiKeys.findAndRemove({ key: keyToDrop });
    res.status(204);
  } catch (error) {
    res.status(500).json({
      message: "an error occurred",
      error,
    });
  }
};

module.exports = {
  generateNewApiKey,
  revokeApiKey,
  dropApiKey,
};
