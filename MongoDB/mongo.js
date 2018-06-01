
const mongoose = require('mongoose');
      mongoose.Promise = global.Promise;

/**
 * Manages a MongoDB connection and a basic CRUD
 * @param {Object} config Database settings
 */
function mongo(config) {
  return {

    /**
     * Connects to MongoDB
     * @returns {Promise} 
     */
    connection(){
      return new Promise((resolve, reject) => {
        mongoose.connect(config.uri, config.options)
          .then(() => { 
            resolve(mongoose.connection.readyState); 
          })
          .catch((err) => { 
            reject(err);
          });        
      });
    },

    /**
     * Saves a new document
     * @param {Object} document The document that will be stored
     * @returns {Promise}
     */
    create(document){
      return new Promise((resolve, reject) => {
        document.save((err, newDocument))
          .then((newDocument) => {
            resolve(newDocument);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },

    /**
     * Gets all stored documents from the specified collection
     * @param {string} model Model name
     * @returns {Promise} 
     */
    read(model){
      return new Promise((resolve, reject) => {
        model.find({}, (err, documents))
          .then((documents) => {
            resolve(documents);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },

    /**
     * Updates an existing document from the specified collection
     * @param {string} model Model name
     * @param {Object} document The document that will be updated
     * @returns {Promise}
     */
    update(model, document){
      return new Promise((resolve, reject) => {
        model.findByIdAndUpdate(document._id, { document }, (err, updatedDocument))
          .then((updatedDocument) => {
            resolve(updatedDocument);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },

    /**
     * Removes an existing document from the specified collection
     * @param {string} model Model name
     * @param {string} id The id of the document that will be deleted
     * @returns {Promise}
     */
    delete(model, id){
      return new Promise((resolve, reject) => {
        model.findByIdAndRemove(id, (err))
          .then(() => {
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    }

  }
}

module.exports = mongo;