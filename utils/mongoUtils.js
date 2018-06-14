
const ObjectId = require('mongodb').ObjectId;

/**
 * MongoDB Utils Module
 * @module MongoUtils utils/mongoUtils
 * @param {object} MongoDB MongoDB module
 */
function mongoUtils (MongoDB) {
  return {
    /**
     * Converts a numerical connection status into literal
     * @param {number} mongooseStatus Mongoose connection state
     * @returns {string} Literal database status
     */
    literalStatus (mongooseStatus){
      const literalStatuses = [ 'disconnected', 'connected', 'connecting', 'disconnecting' ];
      return literalStatuses[mongooseStatus];
    },
    /**
     * Converts the value of the '_id' property into a MongoDB ObjectId
     * @param {object} criteria Criteria or filters that identify a MongoDB document
     * @returns {object} criteria
     */
    parseObjectId (criteria){
      let mongoId = Object.keys(criteria).filter(key => key === '_id');

      if(mongoId.length) {
        let [id] = mongoId;
        criteria[id] = new ObjectId(criteria[id]);
      }

      return criteria;
    }
  }
}

module.exports = mongoUtils;