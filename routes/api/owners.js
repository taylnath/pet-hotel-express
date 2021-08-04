const express = require('express');
const router = express.Router();
const queryAsync = require('../../database/dbcon');
const fs = require('fs');
const { query } = require('express');
var app = express();
app.use(express.urlencoded({extended:false}));
const {dynamicSelect, dynamicUpdate, dynamicInsert} = require('../../database/dynamicQueries');
const sqlDate = require('../../database/sqlDate');

// --------------- routes for Owners ---------------------------------------

router.get('/deletable/:id', async (req, res) => {
  try {
    console.log("in deletable. Id:", req.params.id);
    let result = await queryAsync('select * from Bookings where ownerId=?', [req.params.id]);
    console.log("deletable result:", result);
    if (result.length){
      res.json({"success": false, "message": "This owner has existing bookings. Please delete those bookings before deleting this owner."});
    } else {
      res.json({"success": true});
    }
  } catch (e) {
    console.log(e);
    res.json({"success": false});
  }
});

// --------------- end (Owners)  -------------------------------------------
module.exports = router;