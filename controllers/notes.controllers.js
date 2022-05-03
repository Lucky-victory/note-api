const {
  isEmpty,
  getDateInMilliseconds,
  authorizeUser,
  getNoteById,
} = require("../helpers");
const Notes = require("../models/notes.model");
const Trash = require("../models/trash.model");
const { nanoid } = require("nanoid");

const createNewNote = async (req, res) => {
  try {
    const { user } = req;

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
      id: nanoid(25),
      userId,
      title,
      body,
      createdAt,
      modifiedAt,
      status:'active'
    };
    const { inserted_hashes } = await Notes.create(newNote);
    res.status(201).json({
      message: `successfully added new note with id '${inserted_hashes[0]}'`,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: "an error occurred,couldn't add new note",
    });
  }
};

const getNotesByUser = async (req, res) => {
  try {
    const { user } = req;

    const notes = await Notes.find({
      getAttributes: ["id", "title", "body", "createdAt", "modifiedAt","status"],
      where: `userId='${user.id}' `,
      and: " status='active'",
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
    const { user } = req;
    const { note_id } = req.params;
    const [note, noteErrorMessage] = await getNoteById(note_id);
    if (noteErrorMessage) {
      return res.status(404).json({
        message: noteErrorMessage,
      });
    }
    const authError = authorizeUser(user, note);
    if (authError) {
      return res.status(401).json({
        message: authError,
      });
    }

    // check if the body object is empty
    if (isEmpty(req.body)) {
      return res.status(400).json({
        message: "nothing to update",
      });
    }
    const noteToUpdate = req.body || {};
    noteToUpdate["id"] = note_id;
    noteToUpdate["modifiedAt"] = getDateInMilliseconds();
    await Notes.update([noteToUpdate]);
    res.status(200).json({
      message: `successfully updated note with id '${note_id}'`,
    });
  } catch (error) {
    res.status(500).json({
      message: "an error occurred,couldn't update note",
      error,
    });
  }
};
const moveNoteToTrash = async (req, res) => {
  try {
    const { user } = req;
    const { note_id } = req.params;
    const [note, noteErrorMessage] = await getNoteById(note_id);
    if (noteErrorMessage) {
      return res.status(404).json({
        message: noteErrorMessage,
      });
    }
    const authError = authorizeUser(user, note);
    if (authError) {
      return res.status(401).json({
        message: authError,
      });
    }

    await Notes.update([
      {
        id: note_id,
        status:'deleted'
      },
    ]);
    const deletedAt = getDateInMilliseconds();
    const noteToTrash = {
      deletedAt,
      userId: user.id,
      noteId: note.id,
    };
    await Trash.create(noteToTrash);
    res.status(200).json({
      message: `successfully moved note with id '${note_id}' to trash`,
    });
  } catch (error) {
    res.status(500).json({
      message: "an error occurred,couldn't move note to trash",
      error,
    });
  }
};
const moveNoteFromTrash = async (req, res) => {
  try {
    const { user } = req;
    const noteId = req.params.note_id;
    const [note, noteErrorMessage] = await getNoteById(noteId);
    if (noteErrorMessage) {
      return res.status(404).json({
        message: noteErrorMessage,
      });
    }
    const authError = authorizeUser(user, note);
    if (authError) {
      return res.status(401).json({
        message: authError,
      });
    }

    await Notes.update([
      {
        id: noteId,
        status:'active'
      },
    ]);

    // remove note from Trash table
    await Trash.findAndRemove({ noteId });
    res.status(200).json({
      message: `successfully removed note with id ${noteId} from trash`,
    });
  } catch (error) {
    res.status(500).json({
      message: "an error occurred,couldn't move note to trash",
      error,
    });
  }
};
module.exports = {
  moveNoteFromTrash,
  createNewNote,
  editNote,
  getNotesByUser,
  moveNoteToTrash,
};
