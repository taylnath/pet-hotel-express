function makeDate(textDate) {
  const textDay = parseInt(textDate.slice(8, 10));
  const textMonth = parseInt(textDate.slice(5, 7));
  const textYear = parseInt(textDate.slice(0, 4));
  
  // This method makes Time = 00:00:00, hopefully avoiding Time Zone Hell
  return new Date(textYear, textMonth - 1, textDay);
}

export default makeDate;