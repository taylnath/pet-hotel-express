const express = require('express');
const path = require('path');
const queryAsync = require('./database/dbcon')
const fs = require('fs');
const { query } = require('express');
const apiRoutes = require('./routes/api');
const cors = require('cors'); // maybe we can take this out later

const app = express();

app.use(cors()); // maybe we can take this out later

// body parsing middleware
app.use(express.json());

async function testDB(){
  try{
    // not the best way to read in database file -- currently loading directly to mysql is better
    let testDBSetup = fs.readFileSync('./database/test_db.sql', 'utf8'); // read in file
    testQueries = testDBSetup.split('\n').join(' ').split(';'); // split into queries
    for (let e of testQueries){
      (e.trim()) && await queryAsync(e); // do each query
    }
    queryAsync('select * from test').then(result => console.log(result));
  } catch (e)
  {
    console.error(e);
  }
}

testDB();

// use routes
app.use('/api', apiRoutes);

// server static assets if in production
if (process.env.NODE_ENV === 'production'){
  // set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    // res.sendFile('index.html');
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server started on port ${port}.`));
