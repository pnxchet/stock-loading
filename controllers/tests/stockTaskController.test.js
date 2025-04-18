const stockTaskController = require('../stockTaskController');
const { createTask, updateTask } = require('../../services/stockTaskService');

jest.mock('../../services/stockTaskService');

describe('Stock Task Controller', () => {
    let mockRequest;
    let mockResponse;
    
    beforeEach(() => {
        jest.clearAllMocks();
        mockRequest = {
            body: {},
            params: {}
        };
        
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });
    
    describe('createTask', () => {
        it('should create a task and return 201 status', async () => {
            
            const mockTask = { id: '123', name: 'Test Task' };
            createTask.mockResolvedValue(mockTask);
            mockRequest.body = { name: 'Test Task' };
            
            await stockTaskController.createTask(mockRequest, mockResponse);
            
            expect(createTask).toHaveBeenCalledWith(mockRequest.body);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                task: mockTask
            });
        });
        
        it('should return 400 status when task creation fails', async () => {
            
            const errorMessage = 'Task creation failed';
            createTask.mockRejectedValue(new Error(errorMessage));
            
            await stockTaskController.createTask(mockRequest, mockResponse);
            
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                message: errorMessage
            });
        });
        
        it('should handle empty request body', async () => {
            
            createTask.mockResolvedValue({});
            
            await stockTaskController.createTask(mockRequest, mockResponse);
            
            expect(createTask).toHaveBeenCalledWith({});
            expect(mockResponse.status).toHaveBeenCalledWith(201);
        });
    });
    
    describe('updateTask', () => {
        it('should update a task and return 200 status', async () => {
            
            const mockTaskNumber = 'TASK-123';
            const mockUpdates = { status: 'completed' };
            const mockUpdatedTask = { id: '123', name: 'Test Task', status: 'completed' };
            
            updateTask.mockResolvedValue(mockUpdatedTask);
            mockRequest.params.taskNumber = mockTaskNumber;
            mockRequest.body = mockUpdates;
            
            await stockTaskController.updateTask(mockRequest, mockResponse);
            
            expect(updateTask).toHaveBeenCalledWith(mockTaskNumber, mockUpdates);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                task: mockUpdatedTask
            });
        });
        
        it('should return 400 status when task update fails', async () => {
            
            const errorMessage = 'Task update failed';
            const mockTaskNumber = 'TASK-123';
            
            updateTask.mockRejectedValue(new Error(errorMessage));
            mockRequest.params.taskNumber = mockTaskNumber;
            
            await stockTaskController.updateTask(mockRequest, mockResponse);
            
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                message: errorMessage
            });
        });
        
        it('should handle empty updates', async () => {
            
            const mockTaskNumber = 'TASK-123';
            const mockUpdatedTask = { id: '123', name: 'Test Task' };
            
            updateTask.mockResolvedValue(mockUpdatedTask);
            mockRequest.params.taskNumber = mockTaskNumber;
            mockRequest.body = {};
            
            await stockTaskController.updateTask(mockRequest, mockResponse);
            
            expect(updateTask).toHaveBeenCalledWith(mockTaskNumber, {});
            expect(mockResponse.status).toHaveBeenCalledWith(200);
        });
    });
});