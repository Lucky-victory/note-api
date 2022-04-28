const { connectDB } = require("./db.config");
connectDB();
const ApiKeys = require("../models/apikeys.model");
const Notes = require("../models/notes.model");
const Trash = require("../models/trash.model");
const Users = require("../models/users.model");

const dbInit = async () => {
  await Users.init();
  await Notes.init();
  await Trash.init();
  await ApiKeys.init();
};
dbInit();
module.exports = dbInit;
