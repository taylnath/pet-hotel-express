
// convert sql date to something else. I don't know if I want to use this...
function formatDate(sqlDate) {
  let date = new Date(sqlDate);
  return `${date.getMonth()+1}-${date.getDate()}-${date.getFullYear()}`;
};

// convert javascript date to text date that works with sql
function sqlDate(stringDate){
  let date = new Date(stringDate);
  return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
}

module.exports = sqlDate;