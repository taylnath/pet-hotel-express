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
  });
});

router.post('/', async (req, res) => {
  await queryAsync(
      dynamicInsert(req.body.table, req.body.fieldValueObject))
    .then(result => {
      console.log("dynamicInsert: found", result)
      return res.json(result);
    });
})

router.put('/', async (req, res) => {
  await queryAsync(
      dynamicUpdate(...['table', 'fieldValues', 'identifier', 'id'].map(x => req.body[x])))
    .then(result => {
      console.log("dynamicUpdate: found", result)
      return res.json(result);
    });
});

router.delete('/:table/:identifier/:id', async (req, res) => {
  await queryAsync(
    'delete from ?? where ?? = ?', 
    [req.params.table, req.params.identifier, req.params.id]
  );
  res.json({"success": true});
})


module.exports = router;