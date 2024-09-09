// utils/fileValidator.js
function validateExcelFile(mimetype) {
  // Include MIME type for .ods files
  const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'application/vnd.oasis.opendocument.spreadsheet', // .ods
  ];
  // const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(mimetype)) {
      throw new Error('Invalid file type. Only Excel and ODS files are allowed.');
  }

  // if (file.size > maxSize) {
  //   console.log("size=========");
  //     throw new Error('File size exceeds the limit of 5MB.');
  // }

  return true;
}

module.exports = {
  validateExcelFile,
};
