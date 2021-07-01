
drop table if exists `Owners`;
create table  `Owners` (
  `ownerID` int auto_increment not null primary key,
  `firstName` varchar(255) not null,
  `lastName` varchar(255) not null,
  `email` varchar(255) not null,
  unique key `ownerID`(`ownerID`),
  unique key `email`(`email`)
) ENGINE=InnoDB;
-- Relationships:
-- M:M relationship with pets implemented with ownerID/petID as FK’s of Guests relationship table.
-- 1:M relationship with Bookings implemented with ownerID as FK of Bookings.

drop table if exists `Employees`;
 create table `Employees` (
  `employeeID` int auto_increment not null primary key,
  `firstName` varchar(255) not null,
  `lastName` varchar(255) not null,
  `jobTitle` varchar(255) not null,
  unique key `employeeID`(`employeeID`)
) ENGINE=InnoDB;
-- Relationships:
-- 1:M relationship with Bookings implemented with employeeID as FK of Bookings (this FK can be null)

drop table if exists `Pets`;
create table  `Pets` (
  `petID` int auto_increment not null primary key,
  `name` varchar(255) not null,
  `preferences` varchar(255),
  `type` varchar(255) not null check(`type` = 'dog' or `type` = 'cat'),
  unique key `petID`(`petID`)
) ENGINE=InnoDB;
-- Relationships:
-- M:M relationship with Owners implemented with petID/ownerID as FK’s in Guests relationship table.
-- M:M relationship with Bookings implemented with petID/bookingID in Stays relationship table.
-- M:M relationship with Rooms implemented with petID/roomID as FK’s Stays relationship table.

drop table if exists `Rooms`;
create table  `Rooms` (
  `roomID` int auto_increment not null primary key,
  `description` varchar(255),
  unique key `roomID`(`roomID`)
) ENGINE=InnoDB;
-- Relationships:
-- M:M relationship with Pets implemented with roomID/petID as FK’s  in relationship table Stays.
-- M:M relationship with Bookings implemented with roomID/bookingID as FK’s in relationship table Stays

drop table if exists `Bookings`;
create table  `Bookings` (
  `bookingID` int auto_increment not null primary key,
  `startDate` date not null,
  `endDate` date not null,
  `ownerId` int not null,
  `employeeId` int,
  -- foreign key (`ownerId`) references Owners(`ownerId`),
  -- foreign key (`employeeId`) references Employees(`employeeId`),
  unique key `bookingID`(`bookingID`)
) ENGINE=InnoDB;
-- Relationships:
-- M:1 relationship with Owners
-- M:1 relationship with Employees
-- M:M relationship with Pets implemented with bookingID/petID as FK’s of Stays.
-- M:M relationship with Rooms with bookingID/roomID as FK’s of Stays.

-- Relationship Tables:

drop table if exists `Guests`;
create table  `Guests` (
  `guestID` int auto_increment not null primary key,
  `ownerID` int not null,
  `petID` int not null,
  -- foreign key (`ownerId`) references Owners(`ownerId`),
  -- foreign key (`petId`) references Pets(`petId`),
  unique key `guestID`(`guestID`)
) ENGINE=InnoDB;

drop table if exists `Stays`;
create table  `Stays` (
  `stayID` int auto_increment not null primary key,
  `bookingID` int not null,
  `petID` int not null, -- (constraint: one per room per day),
  `roomID` int,
  -- constraint `something_here1` foreign key (`bookingId`) references `Bookings`(`bookingId`) on delete set null on update cascade,
  -- constraint `something_here2` foreign key (`roomId`) references `Rooms`(`roomId`) on delete set null on update cascade,
  -- constraint `something_here3` foreign key (`petId`) references `Pets`(`petId`) on delete set null on update cascade,
  unique key `stayID`(`stayID`)
) ENGINE=InnoDB;