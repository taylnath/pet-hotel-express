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
  unique key `petId`(`petId`),
  unique `name`(`name`)
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
  constraint `bookings_fk1` foreign key (`ownerId`) references `Owners`(`ownerId`) on delete restrict on update cascade,
  constraint `bookings_fk2` foreign key (`petId`) references `Pets`(`petId`) on delete restrict on update cascade,
  constraint `bookings_fk3` foreign key (`roomId`) references `Rooms`(`roomId`) on delete set null on update cascade,
  constraint `bookings_fk4` foreign key (`employeeId`) references `Employees`(`employeeId`) on delete set null on update cascade,
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

-- example data for hotel

insert into `Owners` values (1, 'Bob', 'Robertson', 'bob@email.biz');
insert into `Owners` values (2, 'Mario', 'Robertson', 'mario@email.biz');
insert into `Owners` values (3, 'Rob', 'Bobertson', 'rob@email.biz');
insert into `Owners` values (4, 'Alice', 'Bobertson', 'alice@email.biz');

insert into `Employees` values (1, 'Bob', 'Robertson', 'Janitor');
insert into `Employees` values (2, 'Mike', 'Michaels', 'Concierge');
insert into `Employees` values (3, 'Erik', 'Marcusson', 'Grooming/Pet Care');
insert into `Employees` values (4, 'Jenna', 'Michaels', 'Pet Play Facilitator');
insert into `Employees` values (5, 'Greg', 'Martin', 'Manager');

insert into `Pets` values (1, 'Fluffy', 'Only likes dogs', 'cat');
insert into `Pets` values (2, 'Scruffy', 'Only likes cats', 'dog');
insert into `Pets` values (3, 'Gruffy', 'Likes neither cats nor dogs', 'cat');
insert into `Pets` values (4, 'Chico', 'Wimpy. Afraid of Black Cats', 'dog');

insert into `Rooms` values (1, 'Our first, and best room');
insert into `Rooms` values (2, 'Our second room is even better.');
insert into `Rooms` values (3, 'Our third room is really the best.');
insert into `Rooms` values (4, 'Spa Room');
insert into `Rooms` values (5, 'Presidential Suite');
insert into `Rooms` values (6, 'The Loft');
insert into `Rooms` values (7, 'The Doghouse');

insert into `Bookings` values (1, '2021-07-30', '2021-07-31', 4, 3, null, 2);
insert into `Bookings` values (2, '2021-07-30', '2021-08-01', 1, 1, 1, 3);
insert into `Bookings` values (3, '2021-07-31', '2021-08-02', 1, 2, 2, 1);
insert into `Bookings` values (4, '2021-07-31', '2021-08-01', 4, 4, null, 2);
insert into `Bookings` values (5, '2021-08-01', '2021-08-03', 3, 3, 3, NULL);
insert into `Bookings` values (6, '2021-08-01', '2021-08-02', 1, 1, NULL, NULL);
insert into `Bookings` values (7, '2021-08-02', '2021-08-04', 1, 2, NULL, NULL);
insert into `Bookings` values (8, '2021-08-02', '2021-08-03', 1, 4, NULL, NULL);
insert into `Bookings` values (9, '2021-08-03', '2021-08-05', 4, 3, NULL, NULL);
insert into `Bookings` values (10, '2021-08-03', '2021-08-04', 1, 1, NULL, NULL);
insert into `Bookings` values (11, '2021-08-04', '2021-08-06', 1, 2, NULL, NULL);
insert into `Bookings` values (12, '2021-08-04', '2021-08-05', 4, 4, NULL, NULL);
insert into `Bookings` values (13, '2021-08-05', '2021-08-07', 3, 3, NULL, NULL);
insert into `Bookings` values (14, '2021-08-05', '2021-08-06', 1, 1, NULL, NULL);
insert into `Bookings` values (15, '2021-08-06', '2021-08-08', 1, 2, NULL, NULL);
insert into `Bookings` values (16, '2021-08-06', '2021-08-07', 1, 4, NULL, NULL);
insert into `Bookings` values (17, '2021-08-07', '2021-08-09', 3, 3, NULL, NULL);
insert into `Bookings` values (18, '2021-08-07', '2021-08-08', 1, 1, NULL, NULL);
insert into `Bookings` values (19, '2021-08-08', '2021-08-10', 1, 2, NULL, NULL);
insert into `Bookings` values (20, '2021-08-08', '2021-08-09', 1, 4, NULL, NULL);
insert into `Bookings` values (21, '2021-08-09', '2021-08-11', 4, 3, NULL, NULL);
insert into `Bookings` values (22, '2021-08-09', '2021-08-10', 1, 1, NULL, NULL);
insert into `Bookings` values (23, '2021-08-10', '2021-08-12', 1, 2, NULL, NULL);

insert into `Guests` values (1, 1, 1);
insert into `Guests` values (2, 1, 2);
insert into `Guests` values (3, 3, 3);
insert into `Guests` values (4, 1, 4);
insert into `Guests` values (5, 4, 3);
insert into `Guests` values (6, 4, 4);