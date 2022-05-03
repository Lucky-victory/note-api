const uuid = require("uuid");
const ApiKeys = require("../models/apikeys.model");
const Notes = require("../models/notes.model");

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
 * generate api key
 */
const generateToken = () => {
  const key = uuid.v4();

  return key;
};
/**
 create new api key and store it in the database
 * 
 */
const createNewApiKey = async (userId, expireIn = 30) => {
  if (isEmpty(userId)) throw new Error("'userId' is required");
  const key = generateToken();
  // expiry date in milliseconds
  const expiresIn = getDateDiff(expireIn);
  const createdAt = getDateInMilliseconds();
  await ApiKeys.create({
    userId,
    key,
    status: "active",
    expiresIn,
    createdAt,
  });
  return { apikey: key };
};

/**
 *
 * @param {string} id
 * @returns
 */
const getNoteById = async (id) => {
  try {
    const note = await Notes.findOne({ id }, [
      "id",
      "title",
      "body",
      "userId",
      "createdAt",
      "modifiedAt",
      "status",
    ]);

    if (!note) {
      return [null, `note with id '${id}' was not found`];
    }

    return [note, null];
  } catch (error) {
    return [null, error];
  }
};
/**
 * check if the user is authorized to access a resource
 */
const authorizeUser = (user, resource) => {
  if (resource.userId !== user.id) {
    return "Unauthorized, not allowed to access this resource";
  }
};

const getApiKeyFromDB = async (key) => {
  try {
    const userKey = await ApiKeys.findOne({ key }, [
      "id",
      "userId",
      "status",
      "expiresIn",
    ]);
    if (!userKey) {
      return [null, "invalid token"];
    }
    return [userKey, null];
  } catch (error) {
    return [null, error];
  }
};
module.exports = {
  getDateInMilliseconds,
  getDateDiff,
  getNoteById,
  NullOrUndefined,
  isEmpty,
  generateToken,
  createNewApiKey,
  authorizeUser,
  getApiKeyFromDB,
};
