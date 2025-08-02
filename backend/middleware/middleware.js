const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('Setting destination for file:', file.originalname);
        cb(null, path.join(__dirname, '../uploads/'));
    },
    filename: (req, file, cb) => {
        console.log('Processing file:', file.originalname);
        const filename = `${Date.now()}-${file.originalname}`;
        console.log('Generated filename:', filename);
        cb(null, filename);
    }
});

const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        console.log('File filter called for:', file.originalname);
        // Accept images only
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

module.exports = upload;
  