// todo: use handlebars instead of express-handlebars? not using express here

const { query } = require('express');
const fs = require('fs');
const dynamic = require('../database/dynamicQueries');
const hbs = require('express-handlebars').create();

const allTables = ['Owners', 'Employees', 'Pets', 'Rooms', 'Bookings', 'Guests'];
const fields = {
  'Owners': ['ownerId', 'firstName', 'lastName', 'email'],
  'Employees': ['employeeId', 'firstName', 'lastName', 'jobTitle'],
  'Pets': ['petId', 'name', 'preferences', 'type'],
  'Rooms': ['roomId', 'description'],
  'Bookings': ['bookingId', 'startDate', 'endDate', 'ownerId', 'petId', 'roomId', 'employeeId'],
  'Guests': ['guestId', 'ownerId', 'petId']
}

const getFieldValueObject = table => {
  let fieldValueObject = {};
  fields[table].slice(1).map(field => {fieldValueObject[field] = ':' + field});
  return fieldValueObject;
}
const errHandler = err => {
  if (err){
    console.error(err);
    return;
  }
}

async function renderTemplates(){
  // generate routes
  console.log("generating routes...");
  for (let table of allTables){
    const tableFile = `./output/routes/${table.toLowerCase()}.js`;
    // header
    fs.writeFile(tableFile, `
const express = require('express');
const router = express.Router();
const queryAsync = require('../../database/dbcon');
const fs = require('fs');
const { query } = require('express');
var app = express();
app.use(express.urlencoded({extended:false}));
const {dynamicSelect, dynamicUpdate, dynamicInsert} = require('../../database/dynamicQueries');
const sqlDate = require('../../database/sqlDate');
    `, errHandler);
    fs.appendFile(tableFile, `\n// Routes for ${table}\n// /api/${table}\n\n`, errHandler);

    // get
    await hbs.render(
        './templates/getRoutes.handlebars', 
        {query: dynamic.dynamicSelect(table)})
      .then(
        res => fs.appendFile(`./output/routes/${table.toLowerCase()}.js`, res, errHandler));
    fs.appendFile(tableFile, '\n\n', errHandler);

    // post
    await hbs.render(
        './templates/postRoutes.handlebars',
        {
          query: dynamic.dynamicInsert(table, getFieldValueObject(table), noValues=true),
          params: '[' + fields[table].slice(1).map(field => 'req.body.' + field).join(', ') + ']'
        })
      .then(
        res => fs.appendFile(tableFile, res, errHandler));
    fs.appendFile(tableFile, '\n\n', errHandler);

    // put
    await hbs.render(
        './templates/putRoutes.handlebars',
        {
          query: dynamic.dynamicUpdate(table, getFieldValueObject(table), fields[table][0], fields[table][0], noValues=true),
          params: '[' + fields[table].slice(1).map(field => 'req.body.' + field).join(', ') + ']'
        })
      .then(
        res => fs.appendFile(tableFile, res, errHandler));
    fs.appendFile(`./output/routes/${table.toLowerCase()}.js`, '\n\n', errHandler);

    // delete
    await hbs.render(
        './templates/deleteRoutes.handlebars',
        {
          query: `delete from ${table} where \`${fields[table][0]}\`=?`,
          params: '[req.params.id]'
        })
      .then(
        res => fs.appendFile(tableFile, res, errHandler));

    // export line
    fs.appendFile(tableFile, '\n\nmodule.exports = router;\n', errHandler);
  }

  // generate queries
  const queryFile = './output/queries/queries.sql';
  fs.writeFile(queryFile, '-- Queries\n-- \':variable\' is used to denote a variable.\n\n-- SELECT Queries:\n', errHandler);
  fs.appendFile(
    queryFile,
    allTables
      .map(x => dynamic.dynamicSelect(x))
      .join(';\n') + ';\n\n',
    errHandler
    );

  fs.appendFile(queryFile, '-- INSERT Queries:\n', errHandler);
  fs.appendFile(
    queryFile,
    Object.entries(fields)
      .map(([table, _]) => dynamic.dynamicInsert(table, getFieldValueObject(table)))
      .join(';\n') + ';\n\n',
    errHandler
  );

  fs.appendFile(queryFile, '-- UPDATE Queries:\n', errHandler);
  fs.appendFile(
    queryFile,
    Object.entries(fields)
      .map(([table, tableFields]) => dynamic.dynamicUpdate(table, getFieldValueObject(table), tableFields[0], ':' + tableFields[0]))
      .join(';\n') + ';\n\n',
    errHandler
  )

  fs.appendFile(queryFile, '-- DELETE Queries:\n', errHandler);
  fs.appendFile(
    queryFile,
    Object.entries(fields)
      .map(([table, tableFields]) => `delete from ${table} where \`${tableFields[0]}\`='${':' + tableFields[0]}'`)
      .join(';\n') + ';\n\n',
    errHandler
  )
}

renderTemplates();