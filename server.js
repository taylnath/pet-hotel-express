const express = require('express');
const path = require('path');
const queryAsync = require('./database/dbcon')
const fs = require('fs');
const { query } = require('express');
const apiRoutes = require('./routes/api/api');
const dynamicRoutes = require('./routes/api/dynamic');
const testRoutes = require('./routes/testing');
const coffeeRoutes = require('./routes/coffee');
const bookingsRoutes = require('./routes/api/bookings');
const employeesRoutes = require('./routes/api/employees');
const reservationsRoutes = require('./routes/api/reservations');
const roomsRoutes = require('./routes/api/rooms');

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
app.use('/api', testRoutes);
app.use('/api/dynamic', dynamicRoutes);
app.use('/coffee', coffeeRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/employees', employeesRoutes);
app.use('/api/reservations', reservationsRoutes);
app.use('/api/rooms', roomsRoutes);

// server static assets if in production
console.log("running in", process.env.NODE_ENV);
if (process.env.NODE_ENV === 'production'){
  // set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    // res.sendFile('index.html');
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}

app.get('*', (req, res) => {
  res.status(500).json({
    msg: 'Oops this page was not supposed to happen.'
  })
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server started on port ${port}.`));
