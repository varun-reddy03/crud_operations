// routes/fileRoutes.js
const fileController = require('../controller/fileController');
const fastifyMulter = require('fastify-multer');
const { validateExcelFile } = require('../utils/validator');
const upload = fastifyMulter();

async function fileRoutes(fastify, options) {
  fastify.post('/upload', { preHandler: upload.single('file') }, fileController.uploadExcelFile);
}

module.exports = fileRoutes;
