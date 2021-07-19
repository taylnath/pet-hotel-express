
const express = require('express');
const router = express.Router();
const queryAsync = require('../../database/dbcon');
const fs = require('fs');
const { query } = require('express');
var app = express();
app.use(express.urlencoded({extended:false}));
const {dynamicSelect, dynamicUpdate, dynamicInsert} = require('../../database/dynamicQueries');
const sqlDate = require('../../database/sqlDate');
    
// Routes for Bookings
// /api/Bookings

router.get('/', async (req, res) => {
  try {
    await queryAsync(
      'select * from `Bookings`'
    )
      .then(result => res.json(result));
  } catch (e) {
    console.error(e);
    res.json({"success": false});
  }
});

router.post('/', async (req, res) => {
  try {
    await queryAsync(
      "insert into `Bookings`  (`startDate`, `endDate`, `ownerId`, `petId`, `roomId`, `employeeId`) values (?, ?, ?, ?, ?, ?)",
      [req.body.startDate, req.body.endDate, req.body.ownerId, req.body.petId, req.body.roomId, req.body.employeeId]
    );
    res.json({"success": true, "operation": "insert"});
  } catch (e) {
    console.error(e);
    res.json({"success": false});
  }
});

router.put('/', async (req, res) => {
  try {
    await queryAsync(
        "update `Bookings` set `startDate`=?, `endDate`=?, `ownerId`=?, `petId`=?, `roomId`=?, `employeeId`=? where `bookingId`=?",
        [req.body.startDate, req.body.endDate, req.body.ownerId, req.body.petId, req.body.roomId, req.body.employeeId]
    );
    res.json({"success": true, "operation": "update"});
  } catch (e) {
    console.error(e);
    res.json({"success": false});
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await queryAsync("delete from Bookings where `bookingId`=?", [req.params.id]);
    res.json({"success": true});
  } catch (e) {
    console.log(e);
    res.json({"success": false});
  }
});

module.exports = router;
