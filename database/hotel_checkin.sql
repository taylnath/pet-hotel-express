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
insert into `Pets` values (4, 'Chico', 'wimpy, afraid of Black Cats', 'dog');

insert into `Rooms` values (1, 'Our first, and best room');
insert into `Rooms` values (2, 'Our second room is even better.');
insert into `Rooms` values (3, 'Our third room is really the best.');

insert into `Bookings` values (1, '2021-07-15', '2021-07-18', 4, 3, null, 2);
insert into `Bookings` values (2, '2021-07-11', '2021-07-25', 1, 1, 1, 3);
insert into `Bookings` values (3, '2021-07-11', '2021-07-25', 1, 2, 2, 1);
insert into `Bookings` values (4, '2021-07-15', '2021-07-18', 4, 3, null, 2);
insert into `Bookings` values (5, '2021-07-16', '2021-07-17', 1, 4, 3, NULL);
insert into `Bookings` values (6, '2021-07-16', '2021-07-17', 1, 2, NULL, NULL);
insert into `Bookings` values (7, '2021-07-17', '2021-07-18', 1, 1, NULL, NULL);
insert into `Bookings` values (8, '2021-07-17', '2021-07-18', 1, 4, NULL, NULL);
insert into `Bookings` values (9, '2021-07-18', '2021-07-19', 1, 2, NULL, NULL);
insert into `Bookings` values (10, '2021-07-18', '2021-07-19', 1, 1, NULL, NULL);
insert into `Bookings` values (11, '2021-07-19', '2021-07-20', 1, 4, NULL, NULL);
insert into `Bookings` values (12, '2021-07-19', '2021-07-20', 1, 2, NULL, NULL);
insert into `Bookings` values (13, '2021-07-20', '2021-07-21', 1, 1, NULL, NULL);
insert into `Bookings` values (14, '2021-07-20', '2021-07-21', 1, 4, NULL, NULL);
insert into `Bookings` values (15, '2021-07-21', '2021-07-22', 1, 2, NULL, NULL);
insert into `Bookings` values (16, '2021-07-21', '2021-07-22', 1, 1, NULL, NULL);
insert into `Bookings` values (17, '2021-07-22', '2021-07-23', 1, 4, NULL, NULL);
insert into `Bookings` values (18, '2021-07-22', '2021-07-23', 1, 2, NULL, NULL);
insert into `Bookings` values (19, '2021-07-23', '2021-07-24', 1, 1, NULL, NULL);
insert into `Bookings` values (20, '2021-07-23', '2021-07-24', 1, 4, NULL, NULL);
insert into `Bookings` values (21, '2021-07-24', '2021-07-25', 1, 2, NULL, NULL);
insert into `Bookings` values (22, '2021-07-24', '2021-07-25', 1, 1, NULL, NULL);
insert into `Bookings` values (23, '2021-07-25', '2021-07-26', 1, 4, NULL, NULL);

insert into `Guests` values (1, 1, 1);
insert into `Guests` values (2, 1, 2);
insert into `Guests` values (3, 3, 3);
insert into `Guests` values (4, 1, 4);
insert into `Guests` values (5, 4, 3);

