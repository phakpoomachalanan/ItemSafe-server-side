import multer from 'multer'
import path, { dirname, extname } from 'path'


const __dirname = process.cwd()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '/dump'))
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    },
})
  
export const upload = multer({ storage: storage })