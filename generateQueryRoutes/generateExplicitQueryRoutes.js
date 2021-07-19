// todo: use handlebars instead of express-handlebars? not using express here

const fs = require('fs');
const dynamic = require('../database/dynamicQueries');
const hbs = require('express-handlebars').create({helpers: {
  dynamicSelect: dynamic.dynamicSelect,
  dynamicInsert: dynamic.dynamicInsert,
  dynamicUpdate: dynamic.dynamicUpdate
},
  partialsDir: './templates/partials',
  layoutsDir: './templates/layouts'
  });

const allTables = ['Owners', 'Employees', 'Pets', 'Rooms', 'Bookings', 'Guests'];
const insertFieldValueObjects = {
  'Employees': {
    firstName: ":firstName",
    lastName: ":lastName",
    jobTitle: ":jobTitle"
  },
  'Owners': {
    
  }
}
const errHandler = err => {
  if (err){
    console.error(err);
    return;
  }
}

async function renderTemplates(){

  // generate routes
  console.log("starting...");
  let result = await hbs.render('./templates/something.handlebars', {something: "hello"});
  for (let table of allTables){
    await hbs.render(
        './templates/getRoutes.handlebars', 
        {query: dynamic.dynamicSelect(table)})
      .then(
        res => fs.writeFile(`./output/routes/${table.toLowerCase()}.js`, res, errHandler));
  }

  // generate queries
  console.log(result);
  fs.writeFile(
    './output/queries/explicitGet.sql',
    allTables
      .map(x => dynamic.dynamicSelect(x))
      .join(';\n') + ';',
    errHandler
    )
  console.log(dynamic.dynamicSelect('Pets'));
}

renderTemplates();