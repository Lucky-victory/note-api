const { getNoteById, authorizeUser } = require("../helpers");
const Notes = require("../models/notes.model");
const Trash = require("../models/trash.model");

const getNotesInTrash = async (req, res) => {
  try {
    const { user } = req;

    const notes = await Notes.find({
      getAttributes: ["id", "title", "body", "createdAt", "modifiedAt"],
      where: `userId='${user.id}' `,
      and: "`deleted`=true",
    });
    res.status(200).json({
      message: `successfully retrieved notes`,
      notes,
    });
  } catch (error) {
    res.status(500).json({
      message: "an error occurred,couldn't retrieve notes",
      error,
    });
  }
};
const deleteNotesInTrash = async (req, res) => {
  try {
    const { user } = req;
    const noteId = req.params.note_id;
    const note = await Trash.findOne({ noteId });
    if (!note) {
      return res.status(404).json({
        message: `note with id '${noteId}' was not found`,
      });
    }
    const authError = authorizeUser(user, note);
    if (authError) {
      return res.status(401).json({
        message: authError,
      });
    }

    await Trash.findAndRemove({ noteId });

    await Notes.findByIdAndRemove([noteId]);
    res.status(200).json({
      message: "permanently deleted note from trash",
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error,
    });
  }
};

module.exports = {
  deleteNotesInTrash,
  getNotesInTrash,
};
