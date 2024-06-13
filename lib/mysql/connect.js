// import mysql from 'mysql'
import mysql from 'mysql2/promise'
import config from 'config';

// Create the connection to database
const db = mysql.createPool({
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
  port: config.mysql.port
});

/* mysql lib 사용 시 Connection Pool */
// db.connect((err) => {
//   if (err) console.log(err)
// });

/* mysql2 lib 사용 시 Connection Pool */
await db.getConnection(function(err, conn) { if(err) console.log(err); });

export { db }