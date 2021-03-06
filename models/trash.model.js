const { Schema, Model } = require("harpee");

const NotesSchema = new Schema({
  name: "NotesSchema",
  fields: {
    userId: String,
    noteId: String,
    deletedAt: Date,
  },
  primaryKey: "id",
});

const Trash = new Model("Trash", NotesSchema);

module.exports = Trash;
