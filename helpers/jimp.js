const Jimp = require("jimp");
const { storeImage } = require("../middleware/upload");
const path = require("path");

async function normalizeImage({ path: pathname, filename }) {
  Jimp.read(pathname, (err, avatar) => {
    if (err) throw err;
    avatar
      .cover(250, 250)
      .quality(60)
      .greyscale()
      .write(path.join(storeImage, filename));
  });
}
module.exports = {
  normalizeImage,
};
