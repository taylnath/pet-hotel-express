const mysql = require('mysql');
require('dotenv').config();

// init mysql
const pool = mysql.createPool({
  connectionLimit: 10, // this is the default
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB,
  dateStrings: true,
  // flags: '-MULTI_STATEMENTS' // for initial testing from file -- do we need this?
  // TODO: export a separate connection just for testing with mullti statements
});

// wrapper that makes pool queries return a promise
function promisePool(query, vars){
  return new Promise((res, rej) => {
    pool.query(query, vars, (err, rows, fields) => {
      if (err){
        rej(err);
      } else {
        res(rows);
      }
    })
  });
}

// alternative -- this may need some adjusting to work
// i.e. the call part might not be quite right
const promisePool2 = (query, vars) => promisify(pool.query).call(query, vars);

module.exports = promisePool
