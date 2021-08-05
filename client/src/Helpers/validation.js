// --------- Form validation  ------------------------------------------------

import {getState} from "../DataAccess/fetchState";


async function petNotDoubleBooked(pet_id, start_date, end_date, setValidation, setModalVisible) {
  
  const petBookingQuery = "select count(`Bookings`.`BookingId`) as `bookingCount` from " +
      "`Bookings` where " + "`Bookings`.`petId` = " + pet_id + " and " +
      "not ((`Bookings`.`endDate` " + " <= '" + start_date + "') or " +
      "(`Bookings`.`startDate` >= '" + end_date + "'));"
  
  let petBookings = await getState(`/api/simpleQuery?query=` + petBookingQuery, () => {
  }, () => {
  }).catch((error) => {
  });
  
  let valid;
  try {
    // if no bookings for this pet and these dates, validation passes
    if (petBookings[0].bookingCount === 0) {
      setValidation({isGood: true});
      return {isGood: true};
    
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
}

export { petNotDoubleBooked }