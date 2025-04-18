const pool = require('../config/db');
const { TaskTypes, TaskStatuses } = require('../utils/enums');

exports.createTask = async (data) => {
  const {
    taskNumber, createdBy, assignedTo, product,
    startedAt, finishedAt, type, status,
    description, dimensions, weight, specialHandlingInstructions
  } = data;

  if (!['manager', 'supervisor'].includes(createdBy.role)) {
    throw new Error('Only manager or supervisor can create tasks.');
  }

  if (type === TaskTypes.URGENT && !description) {
    throw new Error('Urgent tasks require a description.');
  }

  if (type === TaskTypes.SPECIAL) {
    if (!dimensions || !weight || !specialHandlingInstructions) {
      throw new Error('Special load requires all special fields.');
    }
  }

  if (!Object.values(TaskStatuses).includes(status)) {
    throw new Error('Invalid task status.');
  }

  const result = await pool.query(`
    INSERT INTO demo.stock_tasks (
      task_number, created_by_name, created_by_role,
      assigned_to_name, product, started_at, finished_at,
      type, status, description, dimensions, weight, special_handling_instructions
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
    RETURNING *
  `, [
    taskNumber, createdBy.name, createdBy.role,
    assignedTo?.name, product, startedAt, finishedAt,
    type, status, description, dimensions, weight, specialHandlingInstructions
  ]);

  return result.rows[0];
};

exports.updateTask = async (taskNumber, updates) => {

  if (!Object.values(TaskStatuses).includes(updates.status)) {
    throw new Error('Invalid task status.');
  }

  const existing = await pool.query(`SELECT * FROM demo.stock_tasks WHERE task_number = $1`, [taskNumber]);
  if (existing.rowCount === 0) throw new Error('Task not found.');

  const task = { ...existing.rows[0], ...updates };

  const result = await pool.query(`
    UPDATE demo.stock_tasks SET
      created_by_name = $1,
      created_by_role = $2,
      assigned_to_name = $3,
      product = $4,
      started_at = $5,
      finished_at = $6,
      type = $7,
      status = $8,
      description = $9,
      dimensions = $10,
      weight = $11,
      special_handling_instructions = $12
    WHERE task_number = $13
    RETURNING *
  `, [
    task.created_by_name, task.created_by_role, task.assigned_to_name,
    task.product, task.started_at, task.finished_at,
    task.type, task.status, task.description, task.dimensions,
    task.weight, task.special_handling_instructions, taskNumber
  ]);

  return result.rows[0];
};
