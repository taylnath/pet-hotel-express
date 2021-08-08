// --------- Form validation  ------------------------------------------------

import { getState } from "../DataAccess/fetchState";
import {dateToString, makeDate} from "./makeDate";
import {countRoomsQuery, petBookingQuery, roomsBookedQuery} from "./simpleQueries";
import {makeDateList} from "./dateHelpers";


async function validateReservation(booking_id, pet_id, start_date, end_date,
                                   bookings, setValidation, setModalVisible) {
  
  let valid = {};
  let startDateTime = makeDate(start_date).getTime();
  let endDateTime = makeDate(end_date).getTime();

  // Test to ensure booking request is for less than 31 days
  if ((endDateTime - startDateTime) / 86400000 > 30) {
    valid = {
      isGood: false,
      text: "Bookings can only be for a maximum of 30 days. Please try again."
    };
    setValidation(valid);
    setModalVisible(true);
    return valid;
    
    // Test to ensure end date > start date
  } else if(endDateTime < (startDateTime + 86400000)) {
    valid = {
      isGood: false,
      text: "Requested end date not after start date. Please try again."
    };
    setValidation(valid);
    setModalVisible(true);
    return valid;
  }
  
  // Test to ensure Booking request does not double book a Pet
  let bookingQuery = petBookingQuery(booking_id, pet_id, start_date, end_date);
  let petBookings = await getState(`/api/simpleQuery?query=` + bookingQuery, () => {
  }, () => {})
      .catch((error) => {console.log("In validation, error on petBooking Query: ", error)});
  
  try {
    // if no bookings for this pet and these dates, validation passes
    if (petBookings[0].bookingCount === 0) {
      setValidation({isGood: true});
    
      // handle success, but with sqlMessage, as an error
    } else if (petBookings.sqlMessage) {
      valid = {isGood: false, text: petBookings.sqlMessage}
      return valid;
      
      // if a double booking, send a message back
    } else {
      setValidation({
        isGood: false, text: "Your requested dates create a double" +
            "booking for this pet.  Please choose different dates."
      });
      setModalVisible(true);
      valid = {
        isGood: false, text: "Your requested dates create a double" +
            "booking for this pet.  Please choose different dates."
      };
      return valid;
    }
    // handle errors with sqlMessage, or any other type of problem
  } catch (error) {
    if (petBookings.sqlMessage) {
      valid = {isGood: false, text: petBookings.sqlMessage, sqlError: true}
      return valid;
    } else {
      console.log(error);
      valid = {isGood: false, error: true, text: "Unexpected validation error"};
      return valid;
    }
    
  }
  
  // Test to ensure that requested dates do not over-book Pet Hotel
  
  let dateList = makeDateList(startDateTime, endDateTime);
  let numberOfRooms = await getState(`/api/simpleQuery?query=` + countRoomsQuery,
      () => {}, () => {})
      .catch((error) => {console.log("In validation, error on countRoomsQuery: ", error)});
  
  let bookedRooms = await getState(`/api/simpleQuery?query=` +
      roomsBookedQuery(booking_id, start_date, end_date), () => {}, () => {})
      .catch((error) => {console.log("In validation, error on roomsBookedQuery: ", error)});
  
  let roomCount = numberOfRooms[0]["roomCount"];
  let fullDates = [];
  
  // convert SQL dates to millisecond dates to allow math comparisons
  let dates = bookedRooms.map(
      (booking) => booking = {startDate: makeDate(booking.startDate).getTime(),
        endDate: makeDate(booking.endDate).getTime(), bookingId: booking.bookingId}
      );
  
  // Check each day in the requested dates
  for (let i = 0; i < dateList.length; i++) {
    let bookedCount = 0;
    let testDateConv = new Date(dateList[i]);

    // Check each day against each start / end date. Count Bookings for that day.
    for (let j = 0; j < bookedRooms.length; j++) {
      if ((dates[j].startDate <= dateList[i]) && ( dateList[i] < dates[j].endDate) ) {
        bookedCount += 1;
      }
    }
  
    // If the hotel is full this day, add it to the fullDates list
    if (!(bookedCount < roomCount)) {
      if (!fullDates.includes(dateToString(dateList[i]))) {
        fullDates.push(dateToString(dateList[i]))
      }
    }
  }
  // If there are any full days in the requested dates, booking is invalid
  if (fullDates.length) {
    setModalVisible(true);
    let fullList = '';
    fullDates.forEach((fullDate) => {
      fullList += " " + fullDate + ", ";
    });
    fullList = fullList.slice(0, -2);
    
    valid = {
      isGood: false, text: `PetHotel is full on the following dates that you
          requested:   ${fullList}.`
    };
    
    return valid;
  }
  
  // If we reach this, it means that no verification test failed
  return {isGood: true};
}

export { validateReservation }