const multer = require('multer');



const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        console.log('multer',req,file);
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });

const upload = multer({ storage });

module.exports = upload;
  