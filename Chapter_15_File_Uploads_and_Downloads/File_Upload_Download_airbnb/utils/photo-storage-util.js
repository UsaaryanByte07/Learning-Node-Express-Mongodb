const fs = require("fs");
const rootDir = require("./path-util");
const multer = require('multer');
const path = require("path");

const uploadsDir = path.join(rootDir, "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const fileFilter = (req, file, cb) => {
    if(['image/jpg', 'image/png', 'image/jpeg'].includes(file.mimetype)){
        cb(null, true)
    }else{
        cb(null, true)
    }
}

const storage = multer.diskStorage({
    destination: (req, file, cd) => {
        cd(null, uploadsDir);
    },
    filename: (req, file, cd) => {
        const safeTimestamp = new Date().toISOString().replace(/[:.]/g, "-");
        cd(null, `${safeTimestamp}-${file.originalname}`)
    },
})

const deleteFile = (filePath) => {
    fs.unlink(filePath, err => {
        if (err) throw err;
    })
}

module.exports = {
    storage,
    uploadsDir,
    fileFilter,
    deleteFile
}