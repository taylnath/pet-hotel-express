const express = require('express');
const router = express.Router();
const queryAsync = require('../database/dbcon');
const fs = require('fs');
const { query } = require('express');
var app = express();
app.use(express.urlencoded({extended:false}));

// @route   GET /api/logIn
// @desc    Verify Login ID for owner or employee, return all info
// @access  Public
router.get('/logIn', async (req, res) => {
  const userType = req.query.type;        // owner or employee
  const userID = req.query.id;            // owner email or employee id
  let logInQuery;
  console.log(userType);
  console.log(userID);
  
  if (userType === 'owner') {
    logInQuery = "select * from Owners where email=?";
  } else {
    logInQuery = "select * from Employees where employeeID=?";
  }

  // TODO: take out this try/catch once we get error handling working?
  try {
      let result = await queryAsync(logInQuery, [userID]).then(result => res.json(result));

  } catch (e) {
    console.error(e);
    res.status(500);
    res.send('Server error');
  }
});

// @route POST /api/reservations
// @desc  Make a reservation (i.e. a booking)
// @access Public
router.post('/reservations', (req, res) => {
  console.log(req.body);
});

router.get('/ownerPets/:ownerEmail', async (req, res) => {
  console.log("owner requested their pets:", req.params.ownerEmail);
  let pets = await queryAsync(
    "select * from Pets p join Guests g on g.petID = p.petID join Owners o on o.ownerID = g.ownerID where o.ownerID=(select ownerID from Owners where email=?)",
    [req.params.ownerEmail]
  ).then(result => {
    console.log(result);
    return res.json(result);
  });
});

// working on this as of July 9 - TODO
router.get('/getReport', async (req, res) => {
  let report = await queryAsync(
      "select * from Employees"
  ).then(result => {
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