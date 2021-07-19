const express = require('express');
const router = express.Router();
const queryAsync = require('../../database/dbcon');
const fs = require('fs');
const { query } = require('express');
var app = express();
app.use(express.urlencoded({extended:false}));
const {dynamicSelect, dynamicUpdate, dynamicInsert} = require('../../database/dynamicQueries');
const sqlDate = require('../../database/sqlDate');

// --------------- routes for Rooms ---------------------------------------

router.post('/', async (req, res) => {
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

router.put('/', async (req, res) => {
  // console.log(req.body);
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

router.delete('/:id', async (req, res) => {
  try {
    await queryAsync('delete from Rooms where roomId=?', [req.params.id]);
    res.json({"success": true});
  } catch (e) {
    console.log(e);
    res.json({"success": false});
  }
})

// --------------- end (Rooms)  -------------------------------------------
module.exports = router;