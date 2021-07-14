const mysql = require('mysql');

function dynamicQuery(tables, where, groupBy){
  let tableList = tables.split(',');
  let joinHelper = (tableList.length > 1) ? tableList.slice(1).map(table => ' natural join ??').join('') : '';
  let sql = 'select * from ??' + joinHelper;
  sql = mysql.format(sql, tableList);

  if (where && where.length > 0){
    let whereList = where.split(',');
    sql = mysql.format(sql + " where ?? = ?", whereList);

  }

  // todo: add multiple where, groupby
  console.log("dynamicQuery = ", sql)
  return sql;
}

// console.log(dynamicQuery('Bookings,Pets,Groups'));
// console.log(dynamicQuery('Bookings', 'petId,1'));

module.exports = dynamicQuery;