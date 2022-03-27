/* import {multer} from 'multer';
const storage = multer.memoryStorage();
const multerUploads = multer({ storage }).single(‘image’);
export { multerUploads }; */
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
    // if (
    //   file.mimetype === "image/jpeg" ||
    //   file.mimetype === "image/png" ||
    //   file.mimetype === "image/PNG" ||
    //   file.mimetype === "image/jpg" ||
    //   file.mimetype === "image/jfif"
    // ) {
    //   cb(null, true);
    // }
    // else 
    // {
    //   cb({message:"UnSupported File Format"},false);
    // }
  },
  limits:{fileSize: 1080 * 1080 }
});
