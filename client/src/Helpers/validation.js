// --------- Form validation  ------------------------------------------------

import {getState} from "../DataAccess/fetchState";

async function petNotDoubleBooked(pet_id, start_date, end_date) {
  let simpleQuery = "select count(`Bookings`.`bookingId`) as `bookingCount` from " +
      "`Bookings` where " + "`Bookings`.`petId` = " + pet_id + " and " +
      "not ((`Bookings`.`endDate` " + " <= '" + start_date + "') or " +
      "(`Bookings`.`startDate` >= '" + end_date + "'));"
  
  await getState(`/api/simpleQuery?query=` + simpleQuery, () => {}, setLoadingStatus)
      .then((res) => {
        console.log("HAAAYYYYY  ", res[0].bookingCount === 0)
        return (res[0].bookingCount === 0);
      });
}
