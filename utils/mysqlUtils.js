
const fs = require('fs');

/**
 * MySQL Utils Module
 * @module MySQLUtils utils/mysqlUtils
 * @param {object} MySQL MySQL module
 */
function mysqlUtils (MySQL) {
  return {
    /**
     * Runs an SQL script.
     * @param {object} connection MySQL connection
     * @param {string} sqlFile The path where the SQL file is located
     * @returns {Promise} Promise object
     */
    runSource(connection, sqlFile) {
      return new Promise((resolve, reject) => {
        fs.readFile(sqlFile, 'utf8', (err, sql) => {
          if(err){
            reject(err);
          } else {
            connection.query(sql)
              .then(() => {
                return connection.query('select database();');
              })
              .then((db) => {
                resolve(Object.values(...db).join());
              })
              .catch((err) => {
                reject(err);
              });
          }
        });      
      });
    },
    /**
     * Converts a separated property-value pair into an object.
     * @param {string} property 
     * @param {string|number} value 
     * @returns {object} JS object
     */
    parseObject(property, value){
      let val = new RegExp(/^[0-9]*$/gm).test(value) ? `${value}` : `"${value}"`;
      return JSON.parse(`{"${property}":${val}}`);
    },
    /**
     * Converts an array of objects into a string, which will contain a single WHERE condition. 
     * @param {array} fields Array of objects
     * @returns {string} WHERE condition
     */
    parseWhere(fields){
      let [setFields, whereField] = fields;
      let [updatedPk] = Object.keys(setFields).filter(key => key === Object.keys(whereField).toString());
      return typeof updatedPk === 'string' ? MySQL.escape(this.parseObject(updatedPk, setFields[updatedPk])) : MySQL.escape(whereField);
    },
    /**
     * Gets the primary key metadata from the specified table with the LastInsert extra property, which will contain the latest PK-value pair.
     * @param {object} connection MySQL connection
     * @param {string} table Table name
     * @param {object|number} lastInsert Fields (object) or last insert id (number)
     * @returns {Promise} Promise object
     */
    getPrimaryKeyInfo(connection, table, lastInsert){
      return new Promise((resolve, reject) => {
        connection.query(MySQL.format(`DESCRIBE ??`), table)
          .then((fields) => {
            let [info] = fields.filter((field => field.Key === 'PRI'));

            if(typeof lastInsert === 'object'){
              info.LastInsert = this.parseObject(info.Field, lastInsert[Object.keys(lastInsert).filter(prop => prop === info.Field)]);
            } else if (typeof lastInsert === 'number') {
              info.LastInsert = this.parseObject(info.Field, lastInsert);
            }
            
            resolve(info);
          })
          .catch((err) => {
            reject(err);
          });
      });
    }
  }
}

module.exports = mysqlUtils;