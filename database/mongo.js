
const MongoDB = require('mongodb').MongoClient;
const mongoUtils = require('./../utils/mongoUtils')(MongoDB);

/**
 * MongoDB Module - Manages a MongoDB connection and a basic CRUD
 * @module MongoDB database/mongo
 * @param {object} config Configuration parameters
 */
function mongo(config) {
  let db = null;

  return {
    /**
     * Connects to MongoDB.
     * @returns {Promise} Promise object
     */
    connection(){
      return new Promise((resolve, reject) => {
        MongoDB.connect(config.uri)
          .then((client) => {
            db = client.db(config.database);
            resolve(`MongoDB - connected to ${config.database}`);
          })
          .catch((err) => { 
            reject(err);
          });        
      });
    },
    /**
     * Saves a new document in the specified collection.
     * @param {array} args Mixed array as follows: [ 'collection', { property: value } ]
     * @example <caption>Example usage:</caption>
     * // returns { title: 'Sample task', done: false, _id: 5b1fdd384083073ccb9ce59c }
     * MongoDB.create(['tasks', { title: 'Sample task', done: false } ]);
     * @returns {Promise} Promise object
     */
    create(args){
      return new Promise((resolve, reject) => {
        let [coll, values] = args;

        db.collection(coll).insertOne(values)
          .then((result) => {
            let [newDocument] = result.ops;
            resolve(newDocument);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    /**
     * Gets all stored documents from the specified collection.
     * @param {string} coll Collection name
     * @example <caption>Example usage:</caption>
     * // returns [ { _id: 5b1fdd384083073ccb9ce59c, title: 'Sample task', done: false }, ... ]
     * MongoDB.read('tasks');
     * @returns {Promise} Promise object
     */
    read(coll){
      return new Promise((resolve, reject) => {
        db.collection(coll).find({}).toArray()
          .then((documents) => {
            resolve(documents);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    /**
     * Updates an existing document from the specified collection.
     * @param {array} args Mixed array with as follows: [ 'table', { propery: value }, { propery : value } ]
     * @example <caption>Example usage:</caption>
     * // returns { _id: 5b1fdd384083073ccb9ce59c, title: 'Updated task', done: true }
     * MongoDB.update(['tasks', { title: 'Updated task', done: true }, { _id: '5b1fdd384083073ccb9ce59c' }]);
     * @returns {Promise} Promise object
     */
    update(args){
      return new Promise((resolve, reject) => {
        let [coll, values, criteria] = args;
        criteria = mongoUtils.parseObjectId(criteria);

        db.collection(coll).findAndModify(criteria, [], { $set: values }, { upsert: false, new : true })
          .then((res) => {
            resolve(res.value ? res.value : {});
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    /**
     * Removes an existing document from the specified collection.
     * @param {array} args Mixed array with the following structure: [ 'collection', { property: value } ]
     * @example <caption>Example usage:</caption>
     * // returns 1
     * MongoDB.delete( ['tasks', { _id : '5b1fdd384083073ccb9ce59c' }] );
     * // returns 0
     * MongoDB.delete( ['tasks', { title : 'I do not exist!' }] );
     * @returns {Promise} Promise object
     */
    delete(args){
      return new Promise((resolve, reject) => {
        let [coll, criteria] = args;
        criteria = mongoUtils.parseObjectId(criteria);

        db.collection(coll).deleteOne(criteria)
          .then((res) => {
            resolve((res.result.n).toString());
          })
          .catch((err) => {
            reject(err);
          });
      });
    }
  }
}

module.exports = mongo;