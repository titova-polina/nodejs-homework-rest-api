const mongoose = require("mongoose");
const app = require("./app");
const { createFolderIsNotExist, storeImage } = require("./middleware/upload");
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const uriDb = process.env.DB_URI;
const connection = mongoose.connect(uriDb);

connection
  .then(() => {
    app.listen(PORT, function () {
      createFolderIsNotExist(storeImage);
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  })
  .catch((err) =>
    console.log(`Server not running. Error message: ${err.message}`)
  );
