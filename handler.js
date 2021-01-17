'use strict';

module.exports.getPayable = async event => {
  const mysql = require('mysql');
  const connection = mysql.createConnection({
    host: "the endpoint in AWS-RDS ",
    user: "admin",
    password: "*******",
    database: "database"
  });

  const paid = new Promise((resolve) => {
    connection.query("SELECT name, email, phone, total, recurrence FROM invoices LEFT JOIN customers ON invoices.id_invoices = customers.id WHERE due_date BETWEEN DATE_ADD(CURRENT_DATE(), INTERVAL -45 DAY) AND CURRENT_DATE() AND paid = false ORDER BY recurrence DESC;", function(err, results) {
      resolve(results);
    })
  })

  const result = await paid;

  return {
    statusCode: 200,
    body: JSON.stringify({results: result})
  };
};