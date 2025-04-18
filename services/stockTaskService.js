const db = require('../db/fakeDB');
const { TaskTypes, TaskStatuses } = require('../utils/enums');

exports.createTask = async (data) => {
  const { taskNumber, type, createdBy } = data;

  if (db.find(task => task.taskNumber === taskNumber)) {
    throw new Error('Task number must be unique.');
  }

  // Basic role check (simplified)
  if (!['manager', 'supervisor'].includes(createdBy.role)) {
    throw new Error('Only manager or supervisor can create tasks.');
  }

  if (type === TaskTypes.REGULAR && data.status === 'Cancelled by Requester') {
    // OK
  }

  if (type === TaskTypes.URGENT && !data.description) {
    throw new Error('Urgent tasks require a description.');
  }

  if (type === TaskTypes.SPECIAL) {
    if (!data.dimensions || !data.weight || !data.specialHandlingInstructions) {
      throw new Error('Special load requires dimensions, weight, and instructions.');
    }
  }

  db.push(data);
  return data;
};

exports.updateTask = async (taskNumber, updates) => {
  const task = db.find(task => task.taskNumber === taskNumber);
  if (!task) throw new Error('Task not found.');

  Object.assign(task, updates);
  return task;
};
