const express = require('express');
const router = express.Router();
const queryAsync = require('../database/dbcon');
const fs = require('fs');
var app = express();
app.use(express.urlencoded({extended:false}));

// @route   GET /api/testText
// @desc    Get test data
// @access  Public
router.get('/testText', async (req, res) => {
  console.log('Pretending to be slow with text...');
  await new Promise(res => setTimeout(res, 1000));
  console.log('Done with text.');
  res.send('hello this is a test');
});

// @route   GET /api/testData
// @desc    Get test data
// @access  Public
router.get('/testData', async (req, res) => {
  console.log('Pretending to be slow with data...');
  await new Promise(res => setTimeout(res, 1000));
  console.log('Done with data.');
  try{
    // not the best way to read in database file -- currently loading directly to mysql is better
    let testDBSetup = fs.readFileSync('./database/test_db.sql', 'utf8'); // read in file
    testQueries = testDBSetup.split('\n').join(' ').split(';'); // split into queries
    for (let e of testQueries){
      (e.trim()) && await queryAsync(e); // do each query
    }
    queryAsync('select * from test').then(result => res.json(result));
  } catch (e) {
    console.error(e);
    res.status(500);
  }
});

module.exports = router;
