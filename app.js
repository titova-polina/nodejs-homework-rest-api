const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const path = require("node:path");
const multer = require("multer");
const usersRoutes = require("./routes/api/users");
const contactsRoutes = require("./routes/api/contacts");
const app = express();
const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/users", usersRoutes);
app.use("/contacts", contactsRoutes);
app.use("/avatars", express.static(path.join(__dirname, "public", "avatars")));

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((error, req, res, next) => {
  console.log("FINAL ERROR", error);
  if (error instanceof multer.MulterError) {
    if (error.message === "Unexpected field") {
      return res.status(400).send({ message: "Invalid body" });
    }
  }

  res.status(500).send("Internal Server Error");
});

module.exports = app;
