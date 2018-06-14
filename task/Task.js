
/**
 * Task class
 */
class Task {
  /**
   * Create a task.
   * @param {object} database - Database
   */
  constructor(database){
    this.database = database;
  }

  /**
   * Saves a new task
   * @param {array} args Mixed array with the following structure: [ 'origin', { propery: value } ]
   * @returns {Promise} Promise object
   */
  create(args) {
    return new Promise((resolve, reject) => {
      this.database.create(args)
        .then((newTask) => {
          resolve(newTask);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  /**
   * Gets all tasks
   * @param {string} origin Table or collection name
   * @returns {Promise} Promise object 
   */
  read(origin) {
    return new Promise((resolve, reject) => {
      this.database.read(origin)
        .then((tasks) => {
          resolve(tasks);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  /**
   * Updates an existing task
   * @param {array} args Mixed array with the following structure: [ 'origin', { propery: value }, { propery : value } ]
   * @returns {Promise} Promise object
   */
  update(args) {
    return new Promise((resolve, reject) => {
      this.database.update(args)
        .then((updatedTask) => {
          resolve(updatedTask);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  /**
   * Removes an existing task
   * @param {array} args Mixed array with the following structure: [ 'origin', { propery : value } ]
   * @returns {Promise} Promise object
   */
  delete(args) {
    return new Promise((resolve, reject) => {
      this.database.delete(args)
        .then((affectedTasks) => {
          resolve(affectedTasks);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

}

module.exports = Task;