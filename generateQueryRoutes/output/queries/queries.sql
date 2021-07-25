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
delete from Owners where `ownerId`=':ownerId';
delete from Employees where `employeeId`=':employeeId';
delete from Pets where `petId`=':petId';
delete from Rooms where `roomId`=':roomId';
delete from Bookings where `bookingId`=':bookingId';
delete from Guests where `guestId`=':guestId';

