const { getApiKeyFromDB, createNewApiKey } = require("../helpers");
const ApiKeys = require("../models/apikeys.model");

const generateNewApiKey = async (req, res) => {
  try {
    const { token } = req;
    // get the token from database and validate it
    const [userKey, userKeyErrorMessage] = await getApiKeyFromDB(token);
    if (userKeyErrorMessage) {
      return res.status(403).json({
        message: userKeyErrorMessage,
      });
    }

    const { apikey } = await createNewApiKey(userKey.userId);
    res.status(200).json({
      message: "successfully generated new apikey",
      apikey,
    });
  } catch (error) {
    res.statsu(500).json({
      error,
      message: "an error occurred",
    });
  }
};
const revokeApiKey = async (req, res) => {
  try {
    const { token } = req;
    const [userKey, userKeyErrorMessage] = await getApiKeyFromDB(token);
    if (userKeyErrorMessage) {
      return res.status(403).json({
        message: userKeyErrorMessage,
      });
    }
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
    const { token } = req;
    // get the token from database and validate it
    const [userKey, userKeyErrorMessage] = await getApiKeyFromDB(token);
    if (userKeyErrorMessage) {
      return res.status(403).json({
        message: userKeyErrorMessage,
      });
    }
    await ApiKeys.findByIdAndRemove([userKey.id]);
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
