const express = require('express');
const router = express.Router();
const queryAsync = require('../../database/dbcon');
const fs = require('fs');
const { query } = require('express');
var app = express();
app.use(express.urlencoded({extended:false}));
const {dynamicSelect, dynamicUpdate, dynamicInsert} = require('../../database/dynamicQueries');
const sqlDate = require('../../database/sqlDate');


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

router.get('/ownerPets/:ownerEmail', async (req, res) => {
  console.log("owner requested their pets:", req.params.ownerEmail);
  let pets = await queryAsync(
    "select * from Pets p join Guests g on g.petId = p.petId join Owners o on o.ownerId = g.ownerId where o.ownerId=(select ownerId from Owners where email=?)",
    [req.params.ownerEmail]
  ).then(result => {
    // console.log(result);
    res.json(result);
  })
    .catch(err => {
      console.error(err);
      res.json({"success": false});
    });
});





// very uncool generic "just send this query"
// Allows construction of query statement by front end, during development or
// for particularly complex queries
router.get('/simpleQuery', async (req, res) => {
  console.log("In simpleQuery.  req.query = ", req.query.query, typeof req.query);

  let report = await queryAsync(req.query.query)
  .then(result => {
    return res.json(result);
  })
      .catch(err => {
        console.error(err);
        if (err.sqlMessage){
          console.log("SQL error detected:", err.sqlMessage);
          res.json({"success": false, "sqlMessage": err.sqlMessage});
        } else {
          res.json({"success": false});
        }
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