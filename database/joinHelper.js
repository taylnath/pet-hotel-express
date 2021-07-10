joinHelper = {
  Owners: {
    Guests: 'Owners.ownerId = Guests.ownerId',
    Bookings: 'Owners.ownerId = Bookings.ownerId',
  },
  Employees: {
    Bookings: 'Employees.employeeId = Bookings.employeeId'
  }
}

module.exports = joinHelper;