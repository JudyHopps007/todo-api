
const MySQL = require('promise-mysql');
const mysqlUtils = require('./../utils/mysqlUtils')(MySQL);
const sampleSql = `${__dirname}/samples/dbtodo.sql`;

/**
 * Manages a MySQL connection and a basic CRUD.
 * @param {object} config Configuration parameters
 */
function mysql(config) {
  let _conn = null;

  return {
    /**
     * Connects to MySQL and runs a default SQL script if there isn't any available database in the configuration parameters.
     * @param {string} [sqlFile = sampleSql] The path where the SQL file is located
     * @returns {Promise} Promise object
     */
    connection(sqlFile = sampleSql) {
      return new Promise((resolve, reject) => {
        MySQL.createConnection(config)
          .then((conn) => {
            _conn = conn;
            return config.hasOwnProperty('database') ? config.database : mysqlUtils.runSource(_conn, sqlFile);  
          })
          .then((db) => {
            resolve(`MySQL - connected to ${db}`);
          })
          .catch((err) => {
            reject(err);
          })
      });
    },
    /**
     * Saves a new record in the specified table.
     * @param {array} args Mixed array with the following structure: [ 'table', { column: data } ]
     * @example <caption>Example usage:</caption>
     * // returns { id: 3, title: 'Third sample task', done: 1, username: 'user' }
     * MySQL.create(['tasks', { title: 'Third sample task', done: true }]);
     * @example <caption>Output example when a duplicate entry for the primary key was detected:</caption>
     * // returns {}
     * MySQL.create(['users', { username: 'user', passwrd: 'user' }]);
     * @returns {Promise} Promise object
     */
    create(args){
      return new Promise((resolve, reject) => {
        let [table, fields] = args;
        
        mysqlUtils.getPrimaryKeyInfo(_conn, table, fields)
          .then((pk) => {
            return _conn.query(MySQL.format(`SELECT * FROM ?? WHERE ?`), [table, pk.LastInsert]);
          })
          .then((rows) => {
            return rows.length ? {} : _conn.query(MySQL.format(`INSERT INTO ?? SET ?`), args);
          })
          .then((result) => {
            let isAutoincrement = result.affectedRows > 0 && result.insertId > 0;
            return result.hasOwnProperty('affectedRows') ? mysqlUtils.getPrimaryKeyInfo(_conn, table, isAutoincrement ? result.insertId : fields) : {};
          })
          .then((info) => {
            return info.hasOwnProperty("LastInsert") ? _conn.query(MySQL.format(`SELECT * FROM ?? WHERE ?`), [table, info.LastInsert]) : {};
          })
          .then((data) => {
            let row = {};
            if(Object.keys(data).length) [row] = data;
            resolve(row);
          })
          .catch((err) => {
            console.log(err)
            reject(err);
          });
      });
    },
    /**
     * Gets all stored rows from the specified table.
     * @param {string} table Table name
     * @example <caption>Example usage:</caption>
     * // returns [{ id: 1, title: 'First sample task', done: 0, username: 'user' }, ... ]
     * MySQL.read('tasks');
     * @returns {Promise} Promise object
     */
    read(table){
      return new Promise((resolve, reject) => {
        _conn.query(MySQL.format(`SELECT * FROM ??`), [table])
          .then((rows) => {
            resolve(rows);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    /**
     * Updates an existing row of data from the specified table.
     * @param {array} args Mixed array with the following structure: [ 'table', { column: data }, { column : data } ]
     * @example <caption>Example usage:</caption>
     * // returns { id: 2, title: 'Updated task', done: 0, username: 'user' }
     * MySQL.update(['tasks', { title: 'Updated task', done: false }, { id : 2 }]);
     * @example <caption>Output example when a duplicate entry for the primary key was detected:</caption>
     * // returns {}
     * MySQL.update(['users', { username: 'user' }, { username: 'foo' }]);
     * @returns {Promise} Promise object
     */
    update(args){
      return new Promise((resolve, reject) => {
        let [table, ...fields] = args;
        let [setFields] = fields;

        mysqlUtils.getPrimaryKeyInfo(_conn, table, setFields)
          .then((pk) => {
            return _conn.query(MySQL.format(`SELECT * FROM ?? WHERE ?`), [table, pk.LastInsert]);
          })
          .then((rows) => {
            return rows.length ? {} : _conn.query(MySQL.format(`UPDATE ?? SET ? WHERE ?`), args);
          })
          .then((result) => {
            return result.hasOwnProperty('affectedRows') ? _conn.query(`SELECT * FROM ?? WHERE ${mysqlUtils.parseWhere(fields)}`, [table]) : {};
          })
          .then((data) => {
            let row = {};
            if(Object.keys(data).length) [row] = data;
            resolve(row);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    /**
     * Removes an existing row of data from the specified table.
     * @param {array} args Mixed array with the following structure: [ 'table', { column : data } ]
     * @example <caption>Example usage:</caption>
     * // returns 1
     * MySQL.delete( ['tasks', { id : 2 }] );
     * // returns 0
     * MySQL.delete( ['tasks', { id : 'I do not exist!' }] );
     * @returns {Promise} Promise object
     */
    delete(args){
      return new Promise((resolve, reject) => {
        _conn.query(MySQL.format(`DELETE FROM ?? WHERE ?`), args)
          .then((result) => {
            resolve((result.affectedRows).toString());
          })
          .catch((err) => {
            reject(err);
          });
      });
    }
  }
}

module.exports = mysql;