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
    if (!ext.match(/\.(png|PNG|jpg|gif|jpeg)$/)) {
      cb(new Error("file type is not supported"));
      return;
    }
    cb(null,true)
  }

})
