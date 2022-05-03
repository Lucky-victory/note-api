const { getDateInMilliseconds, getApiKeyFromDB } = require("../helpers");
const ApiKeys = require("../models/apikeys.model");
const Users = require("../models/users.model");

/**
 * 
  get token from request 'api_key' query params
 */
const getTokenFromQuery = (req, res, next) => {
  const authInQuery = req.query.api_key;

  if (authInQuery) {
    // append the token to request object, so it can be access by other middlewares
    req.token = authInQuery;

    next();
    return;
  }
  res.status(403).json({ message: "No token provided " });
};

/** 
 get apikey from the database and validate it;
 
 * */

const validateToken = async (req, res, next) => {
  try {
    const key = req.token;
    const [userKey, userKeyError] = await getApiKeyFromDB(key);
    if (userKeyError) {
      res.status(400).json({ message: userKeyError });
      return;
    }
    // check if the key has expired
    const currentDate = getDateInMilliseconds();
    const hasExpired = currentDate >= getDateInMilliseconds(userKey.expiresIn);
    if (userKey && userKey.status == "revoked") {
      res.status(400).json({
        message: "this key has been revoked, please generate a new one",
      });

      return;
    } else if (userKey && hasExpired) {
      // updated Apikey table and set the token to 'expired'
      await ApiKeys.update([
        {
          id: userKey.id,
          status: "expired",
        },
      ]);
      res.status(400).json({
        message: "your apikey has expired, you should generate a new one",
      });
      return;
    }
    req.userKey = userKey;
    next();
  } catch (error) {
    res.status(500).json({ message: "an error occured", error });
  }
};
/**
 *
 * get user by 'id' and set it as a property to 'req' object
 *
 */
const getUserById = async (req, res, next) => {
  try {
    const { userKey } = req;
    const user = await Users.findOne({ id: userKey.userId }, ["id"]);
    if (!user) {
      res.status(404).json({ message: "user not found" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      message: "an error coccurred",
      error,
    });
  }
};

module.exports = {
  getTokenFromQuery,
  validateToken,
  getUserById,
};
