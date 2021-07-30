// This helper adds a day to any date.  Its purpose is to assist in form
// functionality, when we want a reservation end date value to automatically
// adjust (if needed) to be > the reservations start date, and to set a
// form verification 'minimum' for that condition.

function formEndDateHelper (formStartDate, formEndDate) {
  
  // Manipulate date formats so that it works with Safari and IE
  
  // formStartDate
  const startDateDay = parseInt(formStartDate.slice(8, 10));
  const startDateMonth = parseInt(formStartDate.slice(5, 7));
  const startDateYear = parseInt(formStartDate.slice(0, 4));
  // This method makes Time = 00:00:00, hopefully avoiding Time Zone Hell
  let formStartDateParsed = new Date(startDateYear, startDateMonth - 1, startDateDay);
  
  // formEndDate
  const endDateDay = parseInt(formEndDate.slice(8, 10));
  const endDateMonth = parseInt(formEndDate.slice(5, 7));
  const endDateYear = parseInt(formEndDate.slice(0, 4));
  let formEndDateParsed = new Date(endDateYear, endDateMonth - 1, endDateDay);
  
  // Add 1 day to formStartDate using milliseconds
  let endDate = new Date(formStartDateParsed.getTime() + 86400000);
  
  if (formEndDateParsed > endDate) {
    // form end date is > form start date, no action needed
    return false
    
  } else {
    let endDay;
    // Factor in the January = 0 issue
    let endMonth = endDate.getMonth() + 1;
  
    // Deal with the digit issue
    endMonth = endMonth < 10 ? '0' + endMonth : endMonth;
    endDay = endDate.getDate() < 10 ? '0' + endDate.getDate() : endDate.getDate();
    
    // return new endDate for form attributes 'min' and 'value'
    return endDate.getFullYear() + '-' + endMonth + '-' + endDay;
  }
  
}

export default formEndDateHelper;