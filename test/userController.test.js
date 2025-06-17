const userController = require('../controllers/user');
const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

jest.mock('../db/connect', () => ({
  getDatabase: jest.fn(),
}));

describe('User Controller - GET Endpoints', () => {
  const validId = '60d0fe4f5311236168a109cb';

  describe('getAll', () => {
    it('should return all users with status 200', async () => {
      const mockUsers = [
        { name: 'Alice', email: 'alice@example.com' },
        { name: 'Bob', email: 'bob@example.com' },
      ];

      const toArray = jest.fn().mockResolvedValue(mockUsers);
      const find = jest.fn().mockReturnValue({ toArray });
      const collection = jest.fn().mockReturnValue({ find });
      mongodb.getDatabase.mockReturnValue({ collection });

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        setHeader: jest.fn(),
      };

      await userController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    it('should return 500 on error', async () => {
      mongodb.getDatabase.mockImplementation(() => {
        throw new Error('DB failure');
      });

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        setHeader: jest.fn(),
      };

      await userController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'DB failure' });
    });
  });

  describe('getSingle', () => {
    it('should return one user with status 200', async () => {
      const mockUser = {
        _id: validId,
        name: 'Alice',
        email: 'alice@example.com',
      };

      const toArray = jest.fn().mockResolvedValue([mockUser]);
      const find = jest.fn().mockReturnValue({ toArray });
      const collection = jest.fn().mockReturnValue({ find });
      mongodb.getDatabase.mockReturnValue({ collection });

      const req = { params: { id: validId } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        setHeader: jest.fn(),
      };

      await userController.getSingle(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('should return 404 if user not found', async () => {
      const toArray = jest.fn().mockResolvedValue([]);
      const find = jest.fn().mockReturnValue({ toArray });
      const collection = jest.fn().mockReturnValue({ find });
      mongodb.getDatabase.mockReturnValue({ collection });

      const req = { params: { id: validId } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await userController.getSingle(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should return 500 on error', async () => {
      const req = { params: { id: 'invalid-id' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await userController.getSingle(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.any(String) })
      );
    });
  });
});
