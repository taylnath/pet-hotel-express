const express = require('express');
const router = express.Router();
const queryAsync = require('../../database/dbcon');
const fs = require('fs');
const { query } = require('express');
var app = express();
app.use(express.urlencoded({extended:false}));
const {dynamicSelect, dynamicUpdate, dynamicInsert} = require('../../database/dynamicQueries');
const sqlDate = require('../../database/sqlDate');

// --------------- routes for Employees ---------------------------------------

router.post('/', async (req, res) => {
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

router.put('/', async (req, res) => {
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

router.delete('/:id', async (req, res) => {
  try {
    await queryAsync('delete from Employees where employeeId=?', [req.params.id]);
    res.json({"success": true});
  } catch (e) {
    console.log(e);
    res.json({"success": false});
  }
})

// --------------- end (Employees)  -------------------------------------------
module.exports = router;