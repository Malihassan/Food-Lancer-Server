/* import {multer} from 'multer';
const storage = multer.memoryStorage();
const multerUploads = multer({ storage }).single(‘image’);
export { multerUploads }; */
const multer =require("multer");
const path = require("path")
module.exports = multer({
  storage:multer.diskStorage({}),
  fileFilter:(req,file,cb)=>{
    let ext = path.extname(file.originalname);
    if (ext!==".jpg" && ext!==".jfif") {
      cb(new Error("file type is not supported"),false);
      return;
    }
    cb(null,true)
  }

})
