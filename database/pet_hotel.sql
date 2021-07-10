
-- drop tables here to not have foreign key errors
set foreign_key_checks=0; 
drop table if exists `Owners`;
drop table if exists `Employees`;
drop table if exists `Pets`;
drop table if exists `Rooms`;
drop table if exists `Bookings`;
drop table if exists `Guests`;
drop table if exists `Stays`;
set foreign_key_checks=1; 

create table  `Owners` (
  `ownerId` int auto_increment not null primary key,
  `firstName` varchar(255) not null,
  `lastName` varchar(255) not null,
  `email` varchar(255) not null,
  unique key `ownerId`(`ownerId`),
  unique key `email`(`email`)
) ENGINE=InnoDB;
-- Relationships:
-- M:M relationship with pets implemented with ownerId/petId as FK’s of Guests relationship table.
-- 1:M relationship with Bookings implemented with ownerId as FK of Bookings.

 create table `Employees` (
  `employeeId` int auto_increment not null primary key,
  `firstName` varchar(255) not null,
  `lastName` varchar(255) not null,
  `jobTitle` varchar(255) not null,
  unique key `employeeId`(`employeeId`)
) ENGINE=InnoDB;
-- Relationships:
-- 1:M relationship with Bookings implemented with employeeId as FK of Bookings (this FK can be null)

create table  `Pets` (
  `petId` int auto_increment not null primary key,
  `name` varchar(255) not null,
  `preferences` varchar(255),
  `type` varchar(255) not null check(`type` = 'dog' or `type` = 'cat'),
  unique key `petId`(`petId`)
) ENGINE=InnoDB;
-- Relationships:
-- M:M relationship with Owners implemented with petId/ownerId as FK’s in Guests relationship table.
-- M:M relationship with Bookings implemented with petId/bookingId in Stays relationship table.
-- M:M relationship with Rooms implemented with petId/roomId as FK’s Stays relationship table.

create table  `Rooms` (
  `roomId` int auto_increment not null primary key,
  `description` varchar(255),
  unique key `roomId`(`roomId`)
) ENGINE=InnoDB;
-- Relationships:
-- M:M relationship with Pets implemented with roomId/petId as FK’s  in relationship table Stays.
-- M:M relationship with Bookings implemented with roomId/bookingId as FK’s in relationship table Stays

create table  `Bookings` (
  `bookingId` int auto_increment not null primary key,
  `startDate` date not null,
  `endDate` date not null,
  `numberOfRooms` int not null check(`numberOfRooms` > 0),
  `ownerId` int not null,
  `employeeId` int,
  constraint `bookings_fk1` foreign key (`ownerId`) references `Owners`(`ownerId`) on delete cascade on update cascade,
  constraint `bookings_fk2` foreign key (`employeeId`) references `Employees`(`employeeId`) on delete cascade on update cascade,
  unique key `bookingId`(`bookingId`)
) ENGINE=InnoDB;
-- Relationships:
-- M:1 relationship with Owners
-- M:1 relationship with Employees
-- M:M relationship with Pets implemented with bookingId/petId as FK’s of Stays.
-- M:M relationship with Rooms with bookingId/roomId as FK’s of Stays.

-- Relationship Tables:

create table  `Guests` (
  `guestId` int auto_increment not null primary key,
  `ownerId` int not null,
  `petId` int not null,
  constraint `guests_fk1` foreign key (`ownerId`) references `Owners`(`ownerId`) on delete cascade on update cascade,
  constraint `guests_fk2` foreign key (`petId`) references `Pets`(`petId`) on delete cascade on update cascade,
  unique key `guestId`(`guestId`)
) ENGINE=InnoDB;

create table  `Stays` (
  `stayId` int auto_increment not null primary key,
  `bookingId` int not null,
  `petId` int not null, -- (constraint: one per room per day),
  `roomId` int,
  constraint `stays_fk1` foreign key (`bookingId`) references `Bookings`(`bookingId`) on delete cascade on update cascade,
  constraint `stays_fk2` foreign key (`roomId`) references `Rooms`(`roomId`) on delete cascade on update cascade,
  constraint `stays_fk3` foreign key (`petId`) references `Pets`(`petId`) on delete cascade on update cascade,
  unique key `stayId`(`stayId`)
) ENGINE=InnoDB;