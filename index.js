const express = require("express");
const { connectDB } = require("./config/db.config");
connectDB();
const morgan = require("morgan");
const app = express();
const port = process.env.PORT || 4420;
const notesRouter = require("./routes/notes.route");
const usersRouter = require("./routes/users.route");
const tokenRouter = require("./routes/apikeys.route");
const trashRouter = require("./routes/trash.route");

// accept json
app.use(express.json());
// accept form
app.use(
  express.urlencoded({
    extended: false,
  })
);

// log api info
// @ts-ignore
app.use(morgan("dev"));

// set routes
app.use("/notes", notesRouter);
app.use("/trash", trashRouter);
app.use("/account", usersRouter);
app.use("/tokens", tokenRouter);

app.get("/", (req, res) => {
  res.send("hello notes API ");
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
