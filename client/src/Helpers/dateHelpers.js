// TODO: get user's time zone (not sure how to do that)

//format date to string date
import {dateToString} from "./makeDate";

function formatDate(date) {
  // let date = new Date(stringDate);
  return `${date.getMonth()+1}-${date.getDate()}-${date.getFullYear()}`;
}

// Make a list of dates by day, between start date (inclusive) and end date
// (exclusive).  Takes date in millisecond format < Date.getTime() > and returns
// list in database-readable format ('yyyy-mm-dd').  Deals with all dates as
// 00:00:00 time, ignoring time and time zones.

function makeDateList (startDateTime, endDatetime) {
  let dateList = []
  let numberOfDays = (endDatetime - startDateTime) / 86400000
  
  if (numberOfDays <= 0) {
    console.log("Error at function makeDateList: end date <= start date")
    return dateList;
  }
  
  for (let dateTime = startDateTime; dateTime < endDatetime; dateTime += 86400000) {
    dateList.push(dateTime);
  }
  
  return dateList
}

// convert date into format that the date input elements like
function textDateToFormDate(stringDate){
  let [month, day, year] = stringDate.split('-');
  if (month.length === 1){
    month = '0' + month;
  }
  if (day.length === 1){
    day = '0' + day;
  }
  if (year.length > 4){
    year = year.substr(0, 4);
  }
  while (year.length < 4){
    year = '0' + year;
  }
  let date = `${year}-${month}-${day}`;
  return date;
}

let todayDate = new Date();
let tomorrowDate = new Date();
tomorrowDate.setDate(tomorrowDate.getDate() + 1);
let formatToday = formatDate(todayDate);
let formatTomorrow = formatDate(tomorrowDate);
console.log(formatToday);
console.log(formatTomorrow);
export const today = textDateToFormDate(formatToday);
export const tomorrow = textDateToFormDate(formatTomorrow);
export { makeDateList, textDateToFormDate };

