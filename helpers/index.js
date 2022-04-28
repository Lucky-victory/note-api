const uuid = require("uuid");
const ApiKeys = require("../models/apikeys.model");
const Users = require("../models/users.model");

// get date after/ before current date,  default is 30days after today
const getDateDiff = (diff = 30, after = true) => {
  const now = new Date();

  const dateDiff = after
    ? new Date(now.setDate(now.getDate() + diff))
    : new Date(now.setDate(now.getDate() - diff));
  return dateDiff.getTime();
};

const getDateInMilliseconds = (date = new Date().getTime()) =>
  new Date(date).getTime();

// get token from authorization header or from request 'api_key' query params
const getTokenFromHeaderOrQuery = (req) => {
  const authInHeader = req.headers && req.headers["authorization"];
  const authInQuery = req.query.api_key;
  let token;
  if (authInHeader) {
    // split the authorization property and get the second part, e.g Bearer ggu5-fjdi..
    token = authInHeader.split(" ")[1];
    return [token, null];
  } else if (authInQuery) {
    token = authInQuery;
    return [token, null];
  }
  return [null, "No token provided"];
};

// check if a value is null or undefined
const NullOrUndefined = (value) => {
  return (
    Object.prototype.toString.call(value) == "[object Null]" ||
    Object.prototype.toString.call(value) == "[object Undefined]"
  );
};

// check if a value is empty
const isEmpty = (value) => {
  return NullOrUndefined(value) || !Object.keys(value).length || value === "";
};

// get apikey from the database by the token

const getApiKeyFromDB = async (key) => {
  try {
    const userKey = await ApiKeys.findOne({ key }, [
      "id",
      "userId",
      "expired",
      "expiresIn",
    ]);

    // check if the key has expired
    const currentDate = getDateInMilliseconds();
    const hasExpired = currentDate >= getDateInMilliseconds(userKey.expiresIn);

    if (!userKey) {
      return [null, "invalid key"];
    } else if (userKey && hasExpired) {
      await ApiKeys.update([
        {
          id: userKey.id,
          expired: true,
        },
      ]);
      return [null, "your apikey has expired, you should generate a new one"];
    }
    return [userKey, null];
  } catch (error) {
    return [null, error];
  }
};

const getUserById = async (id) => {
  try {
    const user = await Users.findOne({ id }, ["id"]);
    if (!user) {
      return [null, "user not found"];
    }

    return [user, null];
  } catch (error) {
    return [null, error];
  }
};

const generateApiKey = () => {
  const key = uuid.v4();

  return key;
};

module.exports = {
  getDateInMilliseconds,
  getDateDiff,
  getUserById,
  getTokenFromHeaderOrQuery,
  NullOrUndefined,
  isEmpty,
  getApiKeyFromDB,
  generateApiKey,
};
