
const config = {
  host: 'localhost'  || process.env.MYSQL_HOST,
  port: '3306'       || process.env.MYSQL_PORT,
  user: 'root'       || process.env.MYSQL_USER,
  password: 'root'   || process.env.MYSQL_PASS,
  database: 'dbtodo' || process.env.MYSQL_DATABASE,
  multipleStatements: true
}

module.exports = config;