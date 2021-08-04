// This helper module gives constants for the more complex queries

const getPetsRooms = "select `Rooms`.`roomId` as roomId, `Rooms`.`description` " +
    "as description, `Pets`.`name` as petName from `Rooms` left join" +
    " `Bookings` on `Rooms`.`roomId` = `Bookings`.`roomId` left join " +
    "`Pets` on `Pets`.`petId` = `Bookings`.`petId`;"

const getBookings = "select `Bookings`.`bookingId`as `bookingId`, " +
    "concat(`Employees`.`firstName`, ' ', `Employees`.`lastName`) as empName, " +
    "`Employees`.`employeeId` as `employeeId`, " +
    "`Owners`.`email` as `ownerEmail`, `Pets`.`petId` as `petId`, " +
    "concat(`Owners`.`firstName`, ' ', `Owners`.`lastName`) as ownerName, " +
    "`Owners`.`ownerId` as `ownerId`,  `Pets`.`name` as `petName`, " +
    "`Bookings`.`startDate` as `startDate`, `Bookings`.`endDate` as " +
    "`endDate`, `Rooms`.`roomId` as roomId  from `Bookings` left join " +
    "`Owners` on `Owners`.`ownerId` = `Bookings`.`ownerId` " +
    "left join `Pets` on `Pets`.`petId` = `Bookings`.`petId` left join " +
    "`Rooms` on `Rooms`.`roomId` = `Bookings`.`roomId` left join " +
    "`Employees` on `Employees`.`employeeId` = `Bookings`.`employeeId` "

const queryAvailableRooms = "select `roomId`, `description` from `Rooms` where `roomId` not in  " +
    "(select roomId from Bookings natural join `Rooms`)"

export { getPetsRooms, getBookings, queryAvailableRooms }