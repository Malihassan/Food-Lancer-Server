
const multer = require("multer");
const path = require("path");
module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext!==".jpg" && ext!==".jfif"&&ext!==".gif"&&ext!==".jpeg"&&ext!==".png"&&ext!==".PNG") {
      cb(new Error("file type is not supported"),false);
      return;
    }
    cb(null,true)
  },
  limits:{fileSize: 1080 * 1080 }
});
