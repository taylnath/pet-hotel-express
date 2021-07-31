-- Queries
-- ':variable' is used to denote a variable.

-- SELECT Queries:
select * from `Owners`;
select * from `Employees`;
select * from `Pets`;
select * from `Rooms`;
select * from `Bookings`;
select * from `Guests`;

-- INSERT Queries:
insert into `Owners`  (`firstName`, `lastName`, `email`) values (':firstName', ':lastName', ':email');
insert into `Employees`  (`firstName`, `lastName`, `jobTitle`) values (':firstName', ':lastName', ':jobTitle');
insert into `Pets`  (`name`, `preferences`, `type`) values (':name', ':preferences', ':type');
insert into `Rooms`  (`description`) values (':description');
insert into `Bookings`  (`startDate`, `endDate`, `ownerId`, `petId`, `roomId`, `employeeId`) values (':startDate', ':endDate', ':ownerId', ':petId', ':roomId', ':employeeId');
insert into `Guests`  (`ownerId`, `petId`) values (':ownerId', ':petId');

-- UPDATE Queries:
update `Owners` set `firstName`=':firstName', `lastName`=':lastName', `email`=':email' where `ownerId` = ':ownerId';
update `Employees` set `firstName`=':firstName', `lastName`=':lastName', `jobTitle`=':jobTitle' where `employeeId` = ':employeeId';
update `Pets` set `name`=':name', `preferences`=':preferences', `type`=':type' where `petId` = ':petId';
update `Rooms` set `description`=':description' where `roomId` = ':roomId';
update `Bookings` set `startDate`=':startDate', `endDate`=':endDate', `ownerId`=':ownerId', `petId`=':petId', `roomId`=':roomId', `employeeId`=':employeeId' where `bookingId` = ':bookingId';
update `Guests` set `ownerId`=':ownerId', `petId`=':petId' where `guestId` = ':guestId';

-- DELETE Queries:
delete from `Owners` where `ownerId`=':ownerId';
delete from `Employees` where `employeeId`=':employeeId';
delete from `Pets` where `petId`=':petId';
delete from `Rooms` where `roomId`=':roomId';
delete from `Bookings` where `bookingId`=':bookingId';
delete from `Guests` where `guestId`=':guestId';

-- SELECT Queries on multiple tables:

-- Show rooms.  Guest pets are shown if a pet is checked in, otherwise NULL
select `Rooms`.`roomId` as roomId, `Rooms`.`description` as description, `Pets`.`name` as `petName` 
    from `Rooms` left join `Bookings` on `Rooms`.`roomId` = `Bookings`.`roomId` 
    left join `Pets` on `Pets`.`petId` = `Bookings`.`petId`;

-- Show Bookings, with information from Owners, Employees, Rooms, and Pets
select `Bookings`.`bookingId`as `bookingId`, 
    concat(`Employees`.`firstName`, ' ', `Employees`.`lastName`) as `empName`, 
    `Employees`.`employeeId` as `employeeId`, 
    `Owners`.`email` as `ownerEmail`, `Pets`.`petId` as `petId`, 
    concat(`Owners`.`firstName`, ' ', `Owners`.`lastName`) as `ownerName`, 
    `Owners`.`ownerId` as `ownerId`,  `Pets`.`name` as `petName`, 
    `Bookings`.`startDate` as `startDate`, `Bookings`.`endDate` as 
    `endDate`, `Rooms`.`roomId` as `roomId`  from `Bookings` left join 
    `Owners` on `Owners`.`ownerId` = `Bookings`.`ownerId` 
    left join `Pets` on `Pets`.`petId` = `Bookings`.`petId` left join 
    `Rooms` on `Rooms`.`roomId` = `Bookings`.`roomId` left join 
    `Employees` on `Employees`.`employeeId` = `Bookings`.`employeeId` order by
    `Bookings`.`startDate`, `Owners`.`ownerId`;

-- Show unoccupied rooms available to check a Pet into
select `roomId` from `Rooms` where `roomId` not in
    (select `roomId` from `Bookings` natural join `Rooms`);

-- Get an Owner's Pets
select * from `Pets` `p` join `Guests` `g` on `g`.`petId` =  `p`.`petId` join 
    `Owners` `o` on `o`.`ownerId` = `g`.`ownerId` where 
    `o`.`ownerId` = (select `ownerId` from `Owners` where `email` = ':email');
