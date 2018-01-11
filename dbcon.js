var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'DESKTOP-G0EPFHN',
  user            : 'root',
  password        : 'Reuaniets5!',
  database        : 'oak-workout-tracker'
});

module.exports.pool = pool;
