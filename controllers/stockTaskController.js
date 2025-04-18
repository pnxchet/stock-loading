const { createTask, updateTask } = require('../services/stockTaskService');

exports.createTask = async (req, res) => {
  try {
    const task = await createTask(req.body);
    res.status(201).json({
      success: true,
      task
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const taskNumber = req.params.taskNumber;
    const updates = req.body;
    const task = await updateTask(taskNumber, updates);
    res.status(200).json({
      success: true,
      task
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
