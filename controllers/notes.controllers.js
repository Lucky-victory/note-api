const {
  isEmpty,
  getUserById,
  getApiKeyFromDB,
  getDateInMilliseconds,
} = require("../helpers");
const Notes = require("../models/notes.model");

const createNewNote = async (req, res) => {
  try {
    const { token } = req;

    const [userKey, userKeyErrorMessage] = await getApiKeyFromDB(token);
    if (userKeyErrorMessage) {
      return res.status(400).json({
        message: userKeyErrorMessage,
      });
    }

    const [user, userErrorMessage] = await getUserById(userKey.userId);
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
    const createdAt = getDateInMilliseconds();
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
  } catch (error) {
    res.status(500).json({
      error,
      message: "an error occurred,couldn't add new note",
    });
  }
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
    ]);

    if (!note) {
      return [null, `note with '${id}' was not found`];
    }

    return [note, null];
  } catch (error) {
    return [null, error];
  }
};
const getNotesByUser = async (req, res) => {
  try {
    const { token } = req;
    const [userKey, userKeyErrorMessage] = await getApiKeyFromDB(token);
    if (userKeyErrorMessage) {
      return res.status(400).json({
        message: userKeyErrorMessage,
      });
    }

    const [user, userErrorMessage] = await getUserById(userKey.userId);
    if (userErrorMessage) {
      return res.status(404).json({
        message: userErrorMessage,
      });
    }
    const notes = await Notes.find({
      getAttributes: ["id", "title", "body", "createdAt", "modifiedAt"],
      where: `userId='${user.id}'`,
    });
    res.status(200).json({
      message: `successfully retrieved notes`,
      notes,
    });
  } catch (error) {
    res.status(500).json({
      message: "an error occurred,couldn't retrieve otes",
      error,
    });
  }
};
const editNote = async (req, res) => {
  try {
    const { token } = req;
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
    const { note_id } = req.params;
    const [note, noteErrorMessage] = await getNoteById(note_id);
    if (noteErrorMessage) {
      return res.status(404).json({
        message: noteErrorMessage,
      });
    }
    if (note.userId !== user.id) {
      return res.status(401).json({
        message: "Unauthorized, not allowed to edit this note",
      });
    }
    const noteToUpdate = req.body || {};
    noteToUpdate["id"] = note_id;
    await Notes.update([noteToUpdate]);
    res.status(200).json({
      message: `successfully updated note with id ${note_id}`,
    });
  } catch (error) {
    res.status(500).json({
      message: "an error occurred,couldn't update note",
      error,
    });
  }
};
module.exports = { createNewNote, editNote, getNotesByUser };
