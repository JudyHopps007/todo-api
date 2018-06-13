
const express = require('express');
const http = require('http');
const api = express();
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const port = 8000 || process.env.API_PORT;

function server (taskModule) {
  return {
    init(){
      try {
        api.use((req, res, next) => {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
          res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
          res.setHeader('Access-Control-Allow-Credentials', true);
          next();
        });
        api.use(bodyParser.json());
        api.use(bodyParser.urlencoded({ extended: true })); 
        api.use(morgan('dev'));

        const task = taskModule.routes;
        api.post('/task', task.createTask());
        api.get('/tasks', task.readTasks());
        api.put('/task/:id?', task.updateTask());
        api.delete('/task/:id?', task.deleteTask());

        http.createServer(api).listen(port, () => {
          log.info(`Server - http://localhost:${port}`);          
        });
      } catch (err) {
        throw err;
      }
    }
  }
}

module.exports = server;