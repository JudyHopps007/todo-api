
const Task = require('./Task');
const Routes = require('./Routes');

function taskModule(database){
  const task = new Task(database);
  const routes = new Routes(task);
  return { task, routes };
}

module.exports = taskModule;