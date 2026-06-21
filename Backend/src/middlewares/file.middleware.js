const multer = require("multer") // to read pdf

// creating middleware
const upload = multer({ // temporary storage of file only
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 3 * 1024 * 1024 // 3MB
    }
})

module.exports = upload