
// // convert sql date to something else. I don't know if I want to use this...
// function formatDate(sqlDate) {
//   console.log("format date", sqlDate);
//   let date = new Date(sqlDate);
//   return `${date.getMonth()+1}-${date.getDate()}-${date.getFullYear()}`;
// };

// convert javascript date to text date that works with sql
function sqlDate(stringDate){
  // console.log("sqlDate", stringDate);
  let date = new Date(stringDate);
  let result = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()+1}`;
  // console.log("sqlDate result is", result);
  return result;
}

// todo: fix bug - sqlDate currently takes '2021-08-01' and outputs '2021-07-32'
module.exports = sqlDate;