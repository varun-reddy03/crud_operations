// controller/fileController.js
const path = require('path');
const fs = require('fs');
const { validateExcelFile } = require('../utils/validator');

const { User } = require('../models');
const {parseExcel} = require('../services/excelService')

async function uploadExcelFile(request, reply) {
  console.log("=================================")
  const file = request.file;
   try {
    if(validateExcelFile(file.mimetype)){
      if (!file) {
        return reply.status(400).send({ message: 'No file uploaded' });
      }
    const usersData = await parseExcel(file.buffer);
    
    await User.bulkCreate(usersData, { validate: true });
    return reply.send({ message: 'Users data successfully uploaded and stored.' });
 
  }} catch (error) {
    return reply.status(500).send({ error: 'Failed to process the uploaded file.', details: error.message });
 
    console.log('error == ', error);
  }
  
}

module.exports = {
  uploadExcelFile,
};
