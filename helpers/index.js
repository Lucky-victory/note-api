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

/**
 check if a value is null or undefined
 * 
 */
const NullOrUndefined = (value) => {
  return (
    Object.prototype.toString.call(value) == "[object Null]" ||
    Object.prototype.toString.call(value) == "[object Undefined]"
  );
};
/**
 * check if a value is empty
 */
const isEmpty = (value) => {
  return NullOrUndefined(value) || !Object.keys(value).length || value === "";
};

/**
 *
 * @param {string} id
 * @returns
 */
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

/**
 *
 * generate api key
 */
const generateApiKey = () => {
  const key = uuid.v4();

  return key;
};
/**
 create new api key and store it in the database
 * 
 */
const createNewApiKey = async (userId, expireIn = 30) => {
  if (isEmpty(userId)) throw new Error("'userId' is required");
  const key = generateApiKey();
  // expiry date in milliseconds
  const expiresIn = getDateDiff(expireIn);
  const expired = false;
  const revoked = false;
  const createdAt = getDateInMilliseconds();
  await ApiKeys.create({
    userId,
    key,
    revoked,
    expired,
    expiresIn,
    createdAt,
  });
  return { apikey: key };
};
module.exports = {
  getDateInMilliseconds,
  getDateDiff,
  getUserById,
  NullOrUndefined,
  isEmpty,
  generateApiKey,
  createNewApiKey,
};
