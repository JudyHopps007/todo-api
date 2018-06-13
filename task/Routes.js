
class Router {

  constructor(model){
    this.model = model;
  }

  createTask() {
    return async (req, res, next) => {
      try {
        let { origin, values } = req.body;
        res.status(200).send(await this.model.create([origin, values]));
      } catch (err) {
        res.status(500).send(err.message);
      } finally {
        next();
      }
    }
  }

  readTasks() {
    return async (req, res, next) => {
      try {
        let origin = req.path.replace('/', '').trim();
        res.status(200).send(await this.model.read(origin));
      } catch (err) {
        res.status(500).send(err.message);
      } finally {
        next();
      }
    }
  }

  updateTask() {
    return async (req, res, next) => {
      try {
        let { origin, values, criteria } = req.body;
        res.status(200).send(await this.model.update([origin, values, criteria]));
      } catch (err) {
        res.status(500).send(err.message);
      } finally {
        next();
      }
    }
  }

  deleteTask() {
    return async (req, res, next) => {
      try {
        let { origin, criteria } = req.body;
        res.status(200).send(await this.model.delete([origin, criteria]));
      } catch (err) {
        res.status(500).send(err.message);
      } finally {
        next();
      }
    }
  }
  
}

module.exports = Router;