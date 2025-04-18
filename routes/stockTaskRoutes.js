const express = require('express');
const { createTask, updateTask } = require('../controllers/stockTaskController');
const router = express.Router();

router.post('/tasks', createTask);

router.put('/tasks/:taskNumber', updateTask);

module.exports = router;
