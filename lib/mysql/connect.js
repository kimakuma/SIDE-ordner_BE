import mysql from 'mysql2/promise'
import config from 'config';

const db = mysql.createPool({
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
  port: 3306
});

db.getConnection(function(err, conn) { if(err) console.log(err); });

export { db }