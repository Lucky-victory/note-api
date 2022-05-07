const {
  createNewApiKey,
  authorizeUser,
  getApiKeyFromDB,
} = require("../helpers");
const ApiKeys = require("../models/apikeys.model");

const generateNewApiKey = async (req, res) => {
  try {
    const { user } = req;
    const { apikey } = await createNewApiKey(user.id);
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
    const key = req.params.token;
    const { user } = req;
    const [userKey, userKeyError] = await getApiKeyFromDB(key);
    if (userKeyError) {
      res.status(400).json({
        message: userKeyError,
      });
      return;
    }
    const authError = authorizeUser(user, userKey);
    if (authError) {
      return res.status(401).json({
        message: authError,
      });
    }

    await ApiKeys.update([
      {
        id: userKey.id,
        status: "revoked",
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
    const key = req.params.token;
    const { user } = req;
    const [userKey, userKeyError] = await getApiKeyFromDB(key);
    if (userKeyError) {
      res.status(400).json({
        message: userKeyError,
      });
      return;
    }
    const authError = authorizeUser(user, userKey);
    if (authError) {
      return res.status(401).json({
        message: authError,
      });
    }

    await ApiKeys.findAndRemove({ key });
    res.status(200).json({
      message: "key successfully dropped",
    });
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
