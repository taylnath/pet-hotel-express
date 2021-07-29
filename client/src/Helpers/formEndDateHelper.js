// This helper adds a day to any date.

function formEndDateHelper (startDate) {
  
  console.log(endDate);
  
  // Get rid of time zone issues by setting time to 00:00:00
  var start_date = new Date(startDate + " 00:00:00");
  
  // Add 1 day in milliseconds
  var endDate = new Date(start_date.getTime() + 86400000);
  
  // Factor in the January = 0 issue
  let endMonth = endDate.getMonth() + 1;
  
  // Deal with the digit issue
  endMonth = endMonth < 10 ? '0' + endMonth : endMonth;
  let endDay = endDate.getDate() < 10 ? '0' + endDate.getDate() : endDate.getDate();
  
  return endDate.getFullYear() + '-' + endMonth + '-' + endDay;
}

export default formEndDateHelper;