const { createTask, updateTask } = require('../stockTaskService');
const pool = require('../../config/db');
const { TaskTypes } = require('../../utils/enums');

jest.mock('../../config/db');
jest.mock('../../utils/enums', () => ({
    TaskTypes: {
        NORMAL: 'normal',
        URGENT: 'urgent',
        SPECIAL: 'special'
    }
}));

describe('Stock Task Service', () => {
    let mockQueryResult;

    beforeEach(() => {
        jest.clearAllMocks();

        mockQueryResult = {
            rows: [{
                task_number: 'TASK-123',
                created_by_name: 'John Doe',
                created_by_role: 'manager',
                assigned_to_name: 'Jane Smith',
                product: 'Widget',
                status: 'pending',
                type: 'normal'
            }],
            rowCount: 1
        };

        pool.query = jest.fn().mockResolvedValue(mockQueryResult);
    });

    describe('createTask', () => {
        it('should create a task successfully with valid data', async () => {

            const taskData = {
                taskNumber: 'TASK-123',
                createdBy: { name: 'John Doe', role: 'manager' },
                assignedTo: { name: 'Jane Smith' },
                product: 'Widget',
                status: 'pending',
                type: TaskTypes.NORMAL
            };

            const result = await createTask(taskData);

            expect(pool.query).toHaveBeenCalled();
            expect(result).toEqual(mockQueryResult.rows[0]);
        });

        it('should throw error if user is not manager or supervisor', async () => {

            const taskData = {
                taskNumber: 'TASK-123',
                createdBy: { name: 'John Doe', role: 'worker' },
                product: 'Widget',
                type: TaskTypes.NORMAL
            };

            await expect(createTask(taskData))
                .rejects
                .toThrow('Only manager or supervisor can create tasks.');
            expect(pool.query).not.toHaveBeenCalled();
        });

        it('should throw error if urgent task has no description', async () => {

            const taskData = {
                taskNumber: 'TASK-123',
                createdBy: { name: 'John Doe', role: 'manager' },
                product: 'Widget',
                type: TaskTypes.URGENT,
                description: ''
            };

            await expect(createTask(taskData))
                .rejects
                .toThrow('Urgent tasks require a description.');
            expect(pool.query).not.toHaveBeenCalled();
        });

        it('should accept urgent task with description', async () => {

            const taskData = {
                taskNumber: 'TASK-123',
                createdBy: { name: 'John Doe', role: 'manager' },
                product: 'Widget',
                type: TaskTypes.URGENT,
                description: 'This is urgent!'
            };

            await createTask(taskData);

            expect(pool.query).toHaveBeenCalled();
        });

        it('should throw error if special task is missing required fields', async () => {

            const taskData = {
                taskNumber: 'TASK-123',
                createdBy: { name: 'John Doe', role: 'manager' },
                product: 'Widget',
                type: TaskTypes.SPECIAL,
                dimensions: '10x20x30',
            };

            await expect(createTask(taskData))
                .rejects
                .toThrow('Special load requires all special fields.');
            expect(pool.query).not.toHaveBeenCalled();
        });

        it('should accept special task with all required fields', async () => {

            const taskData = {
                taskNumber: 'TASK-123',
                createdBy: { name: 'John Doe', role: 'manager' },
                product: 'Widget',
                type: TaskTypes.SPECIAL,
                dimensions: '10x20x30',
                weight: '50kg',
                specialHandlingInstructions: 'Handle with care'
            };

            await createTask(taskData);

            expect(pool.query).toHaveBeenCalled();
        });
    });

    describe('updateTask', () => {
        it('should throw error if task does not exist', async () => {

            pool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });
            const taskNumber = 'NONEXISTENT-TASK';
            const updates = { status: 'completed' };

            await expect(updateTask(taskNumber, updates))
                .rejects
                .toThrow('Task not found.');
        });

        it('should update task successfully with valid data', async () => {

            const taskNumber = 'TASK-123';
            const updates = { status: 'completed' };

            const result = await updateTask(taskNumber, updates);

            expect(pool.query).toHaveBeenCalledTimes(2);
            expect(result).toEqual(mockQueryResult.rows[0]);
        });

        it('should merge existing data with updates properly', async () => {

            const existingTask = {
                task_number: 'TASK-123',
                created_by_name: 'John Doe',
                created_by_role: 'manager',
                assigned_to_name: 'Jane Smith',
                product: 'Widget',
                started_at: null,
                finished_at: null,
                type: 'normal',
                status: 'pending',
                description: null,
                dimensions: null,
                weight: null,
                special_handling_instructions: null
            };

            pool.query.mockResolvedValueOnce({
                rows: [existingTask],
                rowCount: 1
            });

            const taskNumber = 'TASK-123';
            const updates = {
                status: 'completed',
                finished_at: new Date().toISOString()
            };

            await updateTask(taskNumber, updates);

            const updateCall = pool.query.mock.calls[1];
            const updateParams = updateCall[1];

            expect(updateParams).toContain('completed');
            expect(updateParams).toContain('John Doe');
            expect(updateParams).toContain('manager');
        });
    });
});