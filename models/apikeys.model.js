const { Schema, Model } = require("harpee");

const NotesSchema = new Schema({
  name: "NotesSchema",
  fields: {
    userId: String,
    key: String,
    createdAt: Date,
    expiresIn: Date,
    status: String,
  },
  primaryKey: "id",
});

const ApiKeys = new Model("ApiKeys", NotesSchema);

module.exports = ApiKeys;
