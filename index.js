const express = require("express");
const { connectDB } = require("./config/db.config");
const app = express();
const port = process.env.PORT || 4420;
connectDB();
const userNotesRouter = require("./routes/user-notes.route");
const notesRouter = require("./routes/notes.route");
const usersRouter = require("./routes/users.route");
const tokenRouter = require("./routes/apikeys.route");
// accept json
app.use(express.json());
// accept form
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use("/myNotes", userNotesRouter);
app.use("/notes", notesRouter);
app.use("/account", usersRouter);
app.use("/token", tokenRouter);
app.get("/", (req, res) => {
  res.send("hello notes API ");
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
