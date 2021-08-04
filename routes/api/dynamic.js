const express = require('express');
const router = express.Router();
const queryAsync = require('../../database/dbcon');
const fs = require('fs');
const { query } = require('express');
var app = express();
app.use(express.urlencoded({extended:false}));
const {dynamicSelect, dynamicUpdate, dynamicInsert} = require('../../database/dynamicQueries');
const sqlDate = require('../../database/sqlDate');

// --------------- Super cool generic routes  -------------------------------------------
// working on this as of July 9 - TODO

// todo: add failure catching to these
// todo: make accessing these more uniform?

// route: 
// /api/dynamic


router.get('/', async (req, res) => {
  await queryAsync(
    dynamicSelect(req.query.tables, req.query.where))
      .then(result => {
        // console.log(result);
        return res.json(result);
      })
      .catch(err => {
        console.error(err);
        res.json({"success": false});
      });
});

router.post('/', async (req, res) => {
  await queryAsync(
      dynamicInsert(req.body.table, req.body.fieldValues)
    )
    .then(result => {
      console.log("dynamicInsert: found", result)
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

router.put('/', async (req, res) => {
  await queryAsync(
      dynamicUpdate(...['table', 'fieldValues', 'identifier', 'id'].map(x => req.body[x])))
    .then(result => {
      console.log("dynamicUpdate: found", result)
      return res.json(result);
    })
    .catch(err => {
      console.error(err);
      res.json({"success": false});
    });
});

router.delete('/:table/:identifier/:id', async (req, res) => {
  await queryAsync(
    'delete from ?? where ?? = ?', 
    [req.params.table, req.params.identifier, req.params.id]
  ).then(() => res.json({"success": true}))
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


module.exports = router;