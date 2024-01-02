const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
  destination: "images",
  filename: (req, file, cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
  }
})

const uploadImage = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimeType = fileTypes.test(file.mimetype)
    const extName = fileTypes.test(path.extname(file.originalname))
    if (mimeType && extName){
      return cb(null, true)
    }
    cb("Give proper image types.")
  }
}).single("image")

module.exports = {
  uploadImage
}
