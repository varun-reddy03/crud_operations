// // middleware/multer.js
// const multer = require('fastify-multer');
// const path = require('path');

// // Configure Multer storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, '../uploads')); // Set upload directory
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname); // Preserve original file name
//   },
// });

// // Initialize Multer with storage configuration
// const upload = multer({ storage });

// module.exports = upload;
