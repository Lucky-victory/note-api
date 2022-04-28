const {
  getTokenFromHeaderOrQuery,
  isEmpty,
  getUserById,
  getApiKeyFromDB,
} = require("../helpers");
const ApiKeys = require("../models/apikeys.model");
const Notes = require("../models/notes.model");
const Users = require("../models/users.model");

const createNewNote = async (req, res) => {
  const [token, tokenErrorMessage] = getTokenFromHeaderOrQuery(req);
  if (tokenErrorMessage) {
    return res.status(403).json({
      message: tokenErrorMessage,
    });
  }

  const [keyResult, keyErrorMessage] = await getApiKeyFromDB(token);
  if (keyErrorMessage) {
    return res.status(400).json({
      message: keyErrorMessage,
    });
  }

  const [user, userErrorMessage] = await getUserById(keyResult.userId);
  if (userErrorMessage) {
    return res.status(404).json({
      message: userErrorMessage,
    });
  }
  const userId = user.id;

  if (isEmpty(req.body)) {
    return res.status(400).json({
      message: "please provide a note to add",
    });
  }
  const { title, body } = req.body;
  if (isEmpty(title) && isEmpty(body)) {
    return res.status(400).json({
      message: "can't save an empty note, include atleast `title` or `body` ",
    });
  }
  const createdAt = new Date().getTime();
  const modifiedAt = createdAt;
  const newNote = {
    userId,
    title,
    body,
    createdAt,
    modifiedAt,
    deleted: false,
  };
  const { inserted_hashes } = await Notes.create(newNote);
  res.status(201).json({
    message: `successfully added new note with id ${inserted_hashes[0]}`,
  });
};

module.exports = {createNewNote};
