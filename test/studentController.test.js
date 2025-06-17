const studentController = require('../controllers/student');
const mongodb = require('../db/connect');

// Mock MongoDB
jest.mock('../db/connect', () => ({
  getDatabase: jest.fn(),
}));

describe('GET /students - getAll', () => {
  it('should return all students with status 200', async () => {
    const mockStudents = [
      { name: 'John Doe', email: 'john@example.com' },
      { name: 'Jane Smith', email: 'jane@example.com' },
    ];

    const toArray = jest.fn().mockResolvedValue(mockStudents);
    const find = jest.fn().mockReturnValue({ toArray });
    const collection = jest.fn().mockReturnValue({ find });
    mongodb.getDatabase.mockReturnValue({ collection });

    const req = {}; // No params or body needed
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      setHeader: jest.fn(),
    };

    await studentController.getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockStudents);
  });

  it('should return 500 if there is a database error', async () => {
    mongodb.getDatabase.mockImplementation(() => {
      throw new Error('DB is down');
    });

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      setHeader: jest.fn(),
    };

    await studentController.getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'DB is down' });
  });
});

describe('GET /students/:id - getSingle', () => {
  const validId = '60d0fe4f5311236168a109ca';

  it('should return a student when found', async () => {
    const mockStudent = {
      _id: validId,
      name: 'John Doe',
      email: 'john@example.com',
    };

    const toArray = jest.fn().mockResolvedValue([mockStudent]);
    const find = jest.fn().mockReturnValue({ toArray });
    const collection = jest.fn().mockReturnValue({ find });
    mongodb.getDatabase.mockReturnValue({ collection });

    const req = { params: { id: validId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      setHeader: jest.fn(),
    };

    await studentController.getSingle(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockStudent);
  });

  it('should return 404 if no student is found', async () => {
    const toArray = jest.fn().mockResolvedValue([]);
    const find = jest.fn().mockReturnValue({ toArray });
    const collection = jest.fn().mockReturnValue({ find });
    mongodb.getDatabase.mockReturnValue({ collection });

    const req = { params: { id: validId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await studentController.getSingle(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Student not found' });
  });

  it('should return 500 on error (e.g., invalid ObjectId)', async () => {
    const req = { params: { id: 'invalid-id' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      setHeader: jest.fn(),
    };

    await studentController.getSingle(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.any(String) })
    );
  });
});

describe('POST /students - createStudent', () => {
  it('should create a new student with status 201', async () => {
    const mockStudent = {
      firstName: 'Test',
      lastName: 'Student',
      email: 'test@example.com',
      major: 'Computer Science',
      gpa: 3.5,
    };

    mongodb.getDatabase.mockReturnValue({
      collection: () => ({
        insertOne: jest.fn().mockResolvedValue({ acknowledged: true, insertedId: 'someId' }),
      }),
    });

    const req = { body: mockStudent };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      setHeader: jest.fn(),
    };

    await studentController.createStudent(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ acknowledged: true, insertedId: 'someId' });
  });

  it('should return 500 if student creation fails', async () => {
    mongodb.getDatabase.mockReturnValue({
      collection: () => ({
        insertOne: jest.fn().mockResolvedValue({ acknowledged: false }),
      }),
    });

    const req = { body: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      setHeader: jest.fn(),
    };

    await studentController.createStudent(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Failed to create student' });
  });

  it('should return 500 on database error during creation', async () => {
    mongodb.getDatabase.mockImplementation(() => {
      throw new Error('DB connection error');
    });

    const req = { body: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      setHeader: jest.fn(),
    };

    await studentController.createStudent(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'DB connection error' });
  });
});
