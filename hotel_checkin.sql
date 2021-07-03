-- example data for hotel

insert into `Owners` values (1, 'Bob', 'Robertson', 'bob@email.biz');
insert into `Owners` values (2, 'Mario', 'Robertson', 'mario@email.biz');
insert into `Owners` values (3, 'Rob', 'Bobertson', 'rob@email.biz');
insert into `Owners` values (4, 'Alice', 'Bobertson', 'alice@email.biz');

insert into `Employees` values (1, 'Mike', 'Michaels', 'Concierge');
insert into `Employees` values (2, 'Erik', 'Marcusson', 'Grooming/Pet Care');
insert into `Employees` values (3, 'Jenna', 'Michaels', 'Pet Play Facilitator');
insert into `Employees` values (4, 'Greg', 'Martin', 'Manager');

insert into `Pets` values (1, 'Fluffy', 'Only likes dogs', 'cat');
insert into `Pets` values (2, 'Scruffy', 'Only likes cats', 'dog');
insert into `Pets` values (3, 'Gruffy', 'Likes neither cats nor dogs', 'cat');
insert into `Pets` values (4, 'Chico', 'wimpy, afraid of Black Cats', 'dog');

insert into `Rooms` values (1, 'Our first, and best room');
insert into `Rooms` values (2, 'Our second room is even better.');
insert into `Rooms` values (3, 'Our third room is really the best.');

insert into `Bookings` values (1, '2022-1-11', '2022-1-12', 1, 1, 2);
insert into `Bookings` values (2, '2022-2-10', '2022-2-13', 1, 3, 2);
insert into `Bookings` values (3, '2022-1-11', '2022-1-12', 1, 1, 2);

insert into `Guests` values (1, 1, 1);
insert into `Guests` values (2, 1, 2);
insert into `Guests` values (3, 3, 3);
insert into `Guests` values (4, 1, 4);
insert into `Guests` values (5, 4, 3);

insert into `Stays` values (1, 1, 1, 1);
insert into `Stays` values (2, 1, 2, 3);
insert into `Stays` values (5, 2, 1, null);
insert into `Stays` values (4, 2, 2, null);
insert into `Stays` values (3, 3, 3, null);


