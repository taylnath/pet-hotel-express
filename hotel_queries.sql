-- list owners and their pets
select O.firstName, P.name, P.type from Owners O natural join Guests G natural join Pets P; 

-- get all bookings on a given date (Note that traditionally, end date = checkout date for lodging)
-- thus, checkout date / end date is available to book.  we'll make that explicit to Owner in web display)
select * from Bookings where '2022-1-12' between startDate and (endDate - 1);

-- get all rooms booked on a given date (since we don't plan to assign rooms this is not a query we'll use)
select R.roomID, B.startDate, B.endDate from Bookings B natural join Stays natural join Rooms R;

-- ============================================================================
-- tabular reports
-- ============================================================================

-- Owner List with Pet List
select
  o.ownerID, o.firstName, o.lastName, p.petID, p.name, p.type, p.preferences from
  Owners o left join Guests g on o.ownerID = g.ownerID left join
  Pets p on p.petID = g.petID order by
  o.lastName;

-- Owner List with count of # of Pets they own
select o.ownerID, o.firstName, o.lastName, count(p.petID) as '# of Pets' from
  Owners o left join Guests g on o.ownerID = g.ownerID left join
  Pets p on p.petID = g.petID group by
  o.ownerID order by
  o.lastName, o.firstName asc;