const mysql = require('mysql');

function dynamicSelect(tables, where, groupBy){
  let tableList = tables.split(',');
  let joinHelper = (tableList.length > 1) ? tableList.slice(1).map(table => ' natural join ??').join('') : '';
  let sql = 'select * from ??' + joinHelper;
  sql = mysql.format(sql, tableList);

  if (where && where.length > 0){
    let whereList = where.split(',');
    sql = mysql.format(sql + " where ?? = ?", whereList);

  }
  // todo: add multiple where, groupby
  // todo: allow join type ('left'), and operator ('=', 'is', 'not is')?
  // console.log("dynamicSelect = ", sql)
  return sql;
}

function dynamicInsert(table, fieldValueObject){
  let fieldDescHelper = Object.entries(fieldValueObject).slice(1).map(x => '??, ').join('') + '??';
  let fieldValueHelper = Object.entries(fieldValueObject).slice(1).map(x => '?, ').join('') + '?';
  let sql = 'insert into ??  (' + fieldDescHelper + ') values (' + fieldValueHelper + ')';
  let fieldKeys = [];
  let fieldValues = [];
  Object.keys(fieldValueObject).forEach(x => fieldValues = [...fieldValues, x]);
  Object.values(fieldValueObject).forEach(x => fieldValues = [...fieldValues, x]);
  // console.log(fieldValues);
  sql = mysql.format(sql, [table, ...fieldKeys, ...fieldValues]);

  return sql;
}

function dynamicUpdate(table, fieldValueObject, identifierName, id){
  let fieldValueHelper = Object.entries(fieldValueObject).slice(1).map(x => '??=?, ').join('') + '??=? ';
  let sql = 'update ?? set ' + fieldValueHelper + 'where ?? = ?';
  let fieldValues = [];
  Object.entries(fieldValueObject).forEach(x => fieldValues = [...fieldValues, ...x]);
  sql = mysql.format(sql, [table, ...fieldValues, identifierName, id]);

  return sql;
}

// console.log(dynamicUpdate('Pets', {name: "Art", preferences: "Something here", type: "dog"}, "petId", "2"));
// console.log(dynamicUpdate('Pets', {name: "Art"}, "petId", "2"));
// console.log(dynamicInsert('Pets', {name: "Art", preferences: "Something here", type: "dog"}));
// console.log(dynamicInsert('Pets', {name: "Art"}));
// console.log(dynamicSelect('Bookings,Pets,Groups'));
// console.log(dynamicSelect('Bookings', 'petId,1'));

module.exports = {
  dynamicSelect: dynamicSelect,
  dynamicUpdate: dynamicUpdate,
  dynamicInsert: dynamicInsert
}