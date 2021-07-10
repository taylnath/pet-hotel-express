-- The extra select queries are to act as sort of a table header so you 
-- can make sense of the output of running "source hotel_queries.sql" without 
-- needing to reference this.

-- list owners and their pets
select "list owners and their pets" as ' ';
select O.firstName, P.name, P.type from Owners O natural join Guests G natural join Pets P; 

-- get all bookings on a given date (Note that traditionally, end date = checkout date for lodging)
-- thus, checkout date / end date is available to book.  we'll make that explicit to Owner in web display)
select "get all bookings on a given date" as ' ';
select * from Bookings where '2022-1-12' between startDate and (endDate - 1);

-- get all rooms booked on a given date (since we don't plan to assign rooms this is not a query we'll use)
select "get all rooms booked on a given date" as ' ';
select R.roomId, B.startDate, B.endDate from Bookings B natural join Stays natural join Rooms R;

-- ============================================================================
-- tabular reports
-- ============================================================================

-- Owner List with Pet List
select "Owner List with Pet List" as ' ';
select
  o.ownerId, o.firstName, o.lastName, p.petId, p.name, p.type, p.preferences from
  Owners o left join Guests g on o.ownerId = g.ownerId left join
  Pets p on p.petId = g.petId order by
  o.lastName;

-- Owner List with count of # of Pets they own
select "Owner List with count of # of Pets they own" as ' ';
select o.ownerId, o.firstName, o.lastName, count(p.petId) as '# of Pets' from
  Owners o left join Guests g on o.ownerId = g.ownerId left join
  Pets p on p.petId = g.petId group by
  o.ownerId order by
  o.lastName, o.firstName asc;