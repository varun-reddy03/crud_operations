const xlsx = require('xlsx');

async function parseExcel(file) {
  const workbook = xlsx.read(file, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const jsonData = xlsx.utils.sheet_to_json(sheet);
  
  console.log("---------------->"+jsonData);

  // Transform data to match the database schema
  // const usersData = jsonData.map((row) => ({
  //   firstName: row['firstName'],
  //   lastName: row['lastName'],
  //   email: row['email'],
  //   // Add other fields as necessary
  // }));

  return jsonData;
}

module.exports = 
  {parseExcel}
;
