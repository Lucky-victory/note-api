const { getDateInMilliseconds } = require("../helpers");
const ApiKeys = require("../models/apikeys.model");
const expressAsyncHandler = require("express-async-handler");

/**
 * 
  get token from request 'api_key' query params
 */
const getTokenFromQuery = (req, res, next) => {
  const authInQuery = req.query.api_key;

  if (authInQuery) {
    req.token = authInQuery;
    // append the token to request object, so it can be access by other middlewares
    next();
    return;
  }
  res.status(403).json({ message: "No token provided " });
};

/** 
 get apikey from the database and validate it;
 
 * */

// @ts-ignore
const validateToken = expressAsyncHandler(async (req, res, next) => {
  try {
    // @ts-ignore
    const key = req.token;
    const userKey = await ApiKeys.findOne({ key }, [
      "id",
      "userId",
      "expired",
      "expiresIn",
      "revoked",
    ]);
    console.log(userKey);
    if (!userKey) {
      return res.status(400).json({ message: "invalid token" });
    }
    // check if the key has expired
    const currentDate = getDateInMilliseconds();
    const hasExpired = currentDate >= getDateInMilliseconds(userKey.expiresIn);
    if (userKey && userKey.revoked) {
      return res.status(400).json({
        message: "this key has been revoked, please generate a new one",
      });
    } else if (userKey && hasExpired) {
      await ApiKeys.update([
        {
          id: userKey.id,
          expired: true,
        },
      ]);
      return res.status(400).json({
        message: "your apikey has expired, you should generate a new one",
      });
    }
    // @ts-ignore
    req.userKey = userKey;
    next();
  } catch (error) {
    res.status(500).json({ message: "an error occured", error });
  }
});
module.exports = {
  getTokenFromQuery,
  validateToken,
};
