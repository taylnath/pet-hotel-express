-- Relationship details: see project pdf(s).

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

 create table `Employees` (
  `employeeId` int auto_increment not null primary key,
  `firstName` varchar(255) not null,
  `lastName` varchar(255) not null,
  `jobTitle` varchar(255) not null,
  unique key `employeeId`(`employeeId`)
) ENGINE=InnoDB;

create table  `Pets` (
  `petId` int auto_increment not null primary key,
  `name` varchar(255) not null,
  `preferences` varchar(255),
  `type` varchar(255) not null check(`type` = 'dog' or `type` = 'cat'),
  unique key `petId`(`petId`)
) ENGINE=InnoDB;

create table  `Rooms` (
  `roomId` int auto_increment not null primary key,
  `description` varchar(255),
  unique key `roomId`(`roomId`)
) ENGINE=InnoDB;

create table  `Bookings` (
  `bookingId` int auto_increment not null primary key,
  `startDate` date not null,
  `endDate` date not null,
  `ownerId` int not null,
  `petId` int not null,
  `roomId` int,
  `employeeId` int,
  constraint `bookings_fk1` foreign key (`ownerId`) references `Owners`(`ownerId`) on delete cascade on update cascade,
  constraint `bookings_fk2` foreign key (`petId`) references `Pets`(`petId`) on delete cascade on update cascade,
  constraint `bookings_fk3` foreign key (`roomId`) references `Rooms`(`roomId`) on delete cascade on update cascade,
  constraint `bookings_fk4` foreign key (`employeeId`) references `Employees`(`employeeId`) on delete cascade on update cascade,
  unique key `bookingId`(`bookingId`)
) ENGINE=InnoDB;

-- Relationship Tables:

create table  `Guests` (
  `guestId` int auto_increment not null primary key,
  `ownerId` int not null,
  `petId` int not null,
  constraint `guests_fk1` foreign key (`ownerId`) references `Owners`(`ownerId`) on delete cascade on update cascade,
  constraint `guests_fk2` foreign key (`petId`) references `Pets`(`petId`) on delete cascade on update cascade,
  unique key `guestId`(`guestId`)
) ENGINE=InnoDB;
