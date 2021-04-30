const util = require("util");
const multer = require("multer");
const path = require('path');
const maxSize = 10 * 1024 * 1024;

// Save files in disk
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir + "/resources/static/assets/uploads/");
    },
    filename: (req, file, cb) => {
        console.log(file.originalname);
        cb(null, file.originalname);
    }
});

// Single file upload
let uploadFile = multer({
    storage: storage,
    limits: { fileSize: maxSize},
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single("file");

// Check file type - Allowed extensions
let checkFileType = function checkFileType(file, cb) {
    const filetypes = /mp3|ogg|wav|mp4|audio\/mpeg|audio\/ogg|wma/;

    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null,true);
    } else {
        cb('Only audio files!');
    }
}

// Util module in order to be used with async-await later
let uploadFileMiddleware = util.promisify(uploadFile);

module.exports = uploadFileMiddleware;