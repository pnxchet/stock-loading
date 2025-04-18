const stockTaskService = require('../services/stockTaskService');

exports.createTask = async (req, res) => {
  try {
    const task = await stockTaskService.createTask(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const taskNumber = req.params.taskNumber;
    const updatedTask = await stockTaskService.updateTask(taskNumber, req.body);
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
