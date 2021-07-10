const mysql = require('mysql');

function dynamicQuery(tables, where, groupBy){
  let tableList = tables.split(',');
  let joinHelper = (tableList.length > 1) ? tableList.slice(1).map(table => ' natural join ??').join('') : '';
  let sql = 'select * from ??' + joinHelper;
  sql = mysql.format(sql, tableList);

  // todo: add where, groupby
  return sql;
}

// console.log(dynamicQuery('Bookings,Pets,Groups'));
// console.log(dynamicQuery('Bookings'));

module.exports = dynamicQuery;