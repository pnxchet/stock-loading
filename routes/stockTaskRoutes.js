const express = require('express');
const router = express.Router();
const stockTaskController = require('../controllers/stockTaskController');

router.post('/', stockTaskController.createTask);
router.put('/:taskNumber', stockTaskController.updateTask);

module.exports = router;
