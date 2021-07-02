-- list owners and their pets
select O.firstName, P.name, P.type from Owners O natural join Guests G natural join Pets P; 

-- get all bookings on a given date (TODO: is checkout on the last day?)
select * from Bookings where '2022-1-12' between startDate and endDate;

-- get all rooms booked on a given date (since we don't plan to assign rooms this is not a query we'll use)
select R.roomID, B.startDate, B.endDate from Bookings B natural join Stays natural join Rooms R;