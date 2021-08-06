function makeDate(textDate) {
  const textDay = parseInt(textDate.slice(8, 10));
  const textMonth = parseInt(textDate.slice(5, 7));
  const textYear = parseInt(textDate.slice(0, 4));
  
  // This method makes Time = 00:00:00, hopefully avoiding Time Zone Hell
  return new Date(textYear, textMonth - 1, textDay);
}

function dayBefore(textDate) {
  return new Date(makeDate(textDate).getTime() - 86400000);
}
// Take a Date in d.getTime (millisecond) format and return a string 'yyyy-mm-dd'.
function dateToString(dateMilliseconds) {
  let dateObj = new Date(dateMilliseconds);
  let year = dateObj.getFullYear().toString();
  
  let monthNum = dateObj.getMonth() + 1;
  let month;
  monthNum < 10 ? month = '0' + monthNum.toString() : month = monthNum.toString();
  
  let dayNum = dateObj.getDate();
  let day;
  dayNum < 10 ? day = '0' + dayNum.toString() : day = dayNum.toString();
  
  return year + '-' + month + '-' + day;
}

export { makeDate, dayBefore, dateToString };