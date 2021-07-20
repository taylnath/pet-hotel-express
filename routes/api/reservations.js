const express = require('express');
const router = express.Router();
const queryAsync = require('../../database/dbcon');
const fs = require('fs');
const { query } = require('express');
var app = express();
app.use(express.urlencoded({extended:false}));
const {dynamicSelect, dynamicUpdate, dynamicInsert} = require('../../database/dynamicQueries');
const sqlDate = require('../../database/sqlDate');

// @route POST /api/reservations
// @desc  Make a reservation (i.e. a booking)
// @access Public
router.post('/', async (req, res) => {
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

router.put('/', async (req, res) => {
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

router.delete('/:id', async (req, res) => {
  try {
    await queryAsync('delete from Bookings where bookingId=?', [req.params.id]);
    res.json({"success": true});
  } catch (e) {
    console.log(e);
    res.json({"success": false});
  }
})

module.exports = router;