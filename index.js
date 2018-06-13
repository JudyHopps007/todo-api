
global.log = require('winston');

const mongo = require('./database/mongo');
const mongoConfig = require('./config/mongodb');

const mysql = require('./database/mysql');
const mysqlConfig = require('./config/mysql');

const MongoDB = mongo(mongoConfig);
const MySQL = mysql(mysqlConfig);

const DBMS = MongoDB;

DBMS.connection()
  .then((status) => {
    log.info(status);
  })
  .then(() => {
    const task = require('./task')(DBMS);
    const server = require('./server')(task);
    server.init();
  })
  .catch((err) => {
    log.error(err.message);
  });
  