const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename:function (req,file,cb){
    cb(null,Date.now()+path.extname(file.originalname))
  }
});
const upload=multer({
    storage
})


const uploadImageProduct = upload.single("image");

module.exports=uploadImageProduct