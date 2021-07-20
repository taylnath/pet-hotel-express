
const express = require('express');
const router = express.Router();
const queryAsync = require('../../database/dbcon');
const fs = require('fs');
const { query } = require('express');
var app = express();
app.use(express.urlencoded({extended:false}));
const {dynamicSelect, dynamicUpdate, dynamicInsert} = require('../../database/dynamicQueries');
const sqlDate = require('../../database/sqlDate');
    
// Routes for Pets
// /api/Pets

router.get('/', async (req, res) => {
  try {
    await queryAsync(
      'select * from `Pets`'
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
      "insert into `Pets`  (`name`, `preferences`, `type`) values (?, ?, ?)",
      [req.body.name, req.body.preferences, req.body.type]
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
        "update `Pets` set `name`=?, `preferences`=?, `type`=? where `petId`=?",
        [req.body.name, req.body.preferences, req.body.type]
    );
    res.json({"success": true, "operation": "update"});
  } catch (e) {
    console.error(e);
    res.json({"success": false});
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await queryAsync("delete from Pets where `petId`=?", [req.params.id]);
    res.json({"success": true});
  } catch (e) {
    console.log(e);
    res.json({"success": false});
  }
});

module.exports = router;
