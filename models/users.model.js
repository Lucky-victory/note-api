const { Schema, Model } = require("harpee");

const NotesSchema = new Schema({
  name: "NotesSchema",
  fields: {
    firstName: String,
    lastName: String,
    joinedAt: Date,
    email: String,
    password: String,
  },
  primaryKey: "id",
});

const Users = new Model("Users", NotesSchema);

module.exports = Users;
