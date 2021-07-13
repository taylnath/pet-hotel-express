const express = require('express');
const router = express.Router();
const queryAsync = require('../database/dbcon');
const fs = require('fs');
const { query } = require('express');
var app = express();
app.use(express.urlencoded({extended:false}));
const dynamicQuery = require('../database/dynamicQuery');
const sqlDate = require('../database/sqlDate');


// @route   GET /api/logIn
// @desc    Verify Login Id for owner or employee, return all info
// @access  Public
router.get('/logIn', async (req, res) => {
  const userType = req.query.type;        // owner or employee
  const userId = req.query.id;            // owner email or employee id
  let logInQuery;
  console.log(userType);
  console.log(userId);
  
  if (userType === 'owner') {
    logInQuery = "select * from Owners where email=?";
  } else {
    logInQuery = "select * from Employees where employeeId=?";
  }

  // TODO: take out this try/catch once we get error handling working?
  try {
      let result = await queryAsync(logInQuery, [userId]).then(result => res.json(result));

  } catch (e) {
    console.error(e);
    res.status(500);
    res.send('Server error');
  }
});

router.get('/owners', async (req, res) => {
  try {
    let result = await queryAsync('select * from Owners', []).then(result => res.json(result));
  } catch (e) {
    console.log(e);
    res.status(500);
    res.json({"success": false});
  }
})

// @route POST /api/reservations
// @desc  Make a reservation (i.e. a booking)
// @access Public
router.post('/reservations', async (req, res) => {
  console.log(req.body);
  try {
    let result = await queryAsync(
      'insert into Bookings (`startDate`, `endDate`, `ownerId`, `petId`) values (?,?,?,?)',
      [sqlDate(req.body.startDate), sqlDate(req.body.endDate), req.body.ownerId, req.body.petId]
    );
    res.json({"success": true, "operation": "insert"});
  } catch (e) {
    console.log(e);
    res.json({"success": false});
  }
});

router.put('/reservations', async (req, res) => {
  console.log(req.body);
  try {
    let result = await queryAsync(
      'update Bookings set `startDate`=?, `endDate`=?, `ownerId`=?, `petId`=? where `bookingId`=?',
      [sqlDate(req.body.startDate), sqlDate(req.body.endDate), req.body.ownerId, req.body.petId, req.body.bookingId]
    );
    res.json({"success": true, "operation": "update"});
  } catch (e) {
    console.log(e);
    res.json({"success": false});
  }
});

router.delete('/reservations/:id', async (req, res) => {
  try {
    await queryAsync('delete from Bookings where bookingId=?', [req.params.id]);
    res.json({"success": true});
  } catch (e) {
    console.log(e);
    res.json({"success": false});
  }
})

router.get('/ownerPets/:ownerEmail', async (req, res) => {
  console.log("owner requested their pets:", req.params.ownerEmail);
  let pets = await queryAsync(
    "select * from Pets p join Guests g on g.petId = p.petId join Owners o on o.ownerId = g.ownerId where o.ownerId=(select ownerId from Owners where email=?)",
    [req.params.ownerEmail]
  ).then(result => {
    // console.log(result);
    return res.json(result);
  });
});

// --------------- routes for Employees ---------------------------------------

router.post('/employees', async (req, res) => {
  console.log(req.body);
  try {
    let result = await queryAsync(
        'insert into Employees (`firstName`, `lastName`, `jobTitle`) values (?,?,?)',
        [req.body.firstName, req.body.lastName, req.body.jobTitle]
    );
    res.json({"success": true, "operation": "insert"});
  } catch (e) {
    console.log(e);
    res.json({"success": false});
  }
});

router.put('/employees', async (req, res) => {
  console.log(req.body);
  try {
    let result = await queryAsync(
        'update Employees set `firstName`=?, `lastName`=?, `jobTitle`=? where `employeeId`=?',
        [req.body.firstName, req.body.lastName, req.body.jobTitle, req.body.employeeId]
    );
    res.json({"success": true, "operation": "update"});
  } catch (e) {
    console.log(e);
    res.json({"success": false});
  }
});

router.delete('/employees/:id', async (req, res) => {
  try {
    await queryAsync('delete from Employees where employeeId=?', [req.params.id]);
    res.json({"success": true});
  } catch (e) {
    console.log(e);
    res.json({"success": false});
  }
})

// --------------- end (Employees)  -------------------------------------------

// --------------- routes for Rooms ---------------------------------------

router.post('/rooms', async (req, res) => {
  console.log(req.body);
  try {
    let result = await queryAsync(
        'insert into Rooms (`description`) values (?)',
        [req.body.description]
    );
    res.json({"success": true, "operation": "insert"});
  } catch (e) {
    console.log(e);
    res.json({"success": false});
  }
});

router.put('/rooms', async (req, res) => {
  console.log(req.body);
  try {
    let result = await queryAsync(
        'update Rooms set `description`=? where `roomId`=?',
        [req.body.description, req.body.roomId]
    );
    res.json({"success": true, "operation": "update"});
  } catch (e) {
    console.log(e);
    res.json({"success": false});
  }
});

router.delete('/rooms/:id', async (req, res) => {
  try {
    await queryAsync('delete from Rooms where roomId=?', [req.params.id]);
    res.json({"success": true});
  } catch (e) {
    console.log(e);
    res.json({"success": false});
  }
})

// --------------- end (Rooms)  -------------------------------------------


// working on this as of July 9 - TODO
router.get('/getReport', async (req, res) => {
  let report = await queryAsync(dynamicQuery(req.query.tables, req.query.where))
  .then(result => {
    console.log(result);
    return res.json(result);
  });
});

// // @route   POST api/items
// // @desc    Create an Item
// // @access  Public
// router.post('/', (req, res) => {
//   const newItem = new Item({
//     name: req.body.name
//   });

//   newItem.save().then(item => res.json(item)).catch(err => console.log(err));
// });

// // @route   DELETE api/items
// // @desc    Delete an Item
// // @access  Public
// router.delete('/:id', (req, res) => {
//   Item.findById(req.params.id)
//     .then(item => item.remove().then(() => res.json({success: true})))
//     .catch(err => res.status(404).json({success: false}));
// });

module.exports = router;