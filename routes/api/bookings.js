const express = require('express');
const router = express.Router();
const queryAsync = require('../../database/dbcon');
const fs = require('fs');
const { query } = require('express');
var app = express();
app.use(express.urlencoded({extended:false}));
const {dynamicSelect, dynamicUpdate, dynamicInsert} = require('../../database/dynamicQueries');
const sqlDate = require('../../database/sqlDate');

router.put('/', async (req, res) => {
  console.log(req.body);
  try {
    let result = await queryAsync(
        'update Bookings set `startDate`=?, `endDate`=?, `ownerId`=?, `petId`=?, `roomId`=? where `bookingId`=?',
        [req.body.startDate, req.body.endDate, req.body.ownerId, req.body.petId, req.body.roomId, req.body.bookingId]
    );
    res.json({"success": true, "operation": "update"});
  } catch (e) {
    console.log(e);
    res.json({"success": false});
  }
});

module.exports = router;