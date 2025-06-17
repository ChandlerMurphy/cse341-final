const teacherController = require('../controllers/teacher');
const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

jest.mock('../db/connect');

const mockJson = jest.fn();
const mockStatus = jest.fn(() => ({ json: mockJson }));
const mockRes = { status: mockStatus, setHeader: jest.fn() };

beforeAll(() => {
  // Suppress console.error during tests
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Teacher Controller - getAll', () => {
  it('should return 200 and a list of teachers', async () => {
    const mockTeachers = [{ name: 'Ms. White' }, { name: 'Mr. Black' }];

    mongodb.getDatabase.mockReturnValue({
      collection: () => ({
        find: () => ({
          toArray: () => Promise.resolve(mockTeachers),
        }),
      }),
    });

    await teacherController.getAll({}, mockRes);

    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith(mockTeachers);
  });

  it('should return 500 if database fails', async () => {
    mongodb.getDatabase.mockImplementation(() => {
      throw new Error('DB error');
    });

    await teacherController.getAll({}, mockRes);

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({ message: 'DB error' });
  });
});

describe('Teacher Controller - getSingle', () => {
  it('should return 200 and a single teacher if found', async () => {
    const mockTeacher = { _id: new ObjectId(), name: 'Dr. Green' };
    const req = { params: { id: mockTeacher._id.toHexString() } };

    mongodb.getDatabase.mockReturnValue({
      collection: () => ({
        find: () => ({
          toArray: () => Promise.resolve([mockTeacher]),
        }),
      }),
    });

    await teacherController.getSingle(req, mockRes);

    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith(mockTeacher);
  });

  it('should return 404 if teacher is not found', async () => {
    const req = { params: { id: new ObjectId().toHexString() } };

    mongodb.getDatabase.mockReturnValue({
      collection: () => ({
        find: () => ({
          toArray: () => Promise.resolve([]),
        }),
      }),
    });

    await teacherController.getSingle(req, mockRes);

    expect(mockStatus).toHaveBeenCalledWith(404);
    expect(mockJson).toHaveBeenCalledWith({ message: 'Teacher not found' });
  });

  it('should return 500 if ObjectId is invalid or other error occurs', async () => {
    const req = { params: { id: 'invalid-id' } };

    await teacherController.getSingle(req, mockRes);

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.any(String) })
    );
  });
});

describe('Teacher Controller - createTeacher', () => {
  it('should create a new teacher with status 201', async () => {
    const mockTeacher = {
      firstName: 'Test',
      lastName: 'Teacher',
      email: 'test.teacher@example.com',
      department: 'Computer Science',
      rank: 'Professor',
    };

    mongodb.getDatabase.mockReturnValue({
      collection: () => ({
        insertOne: jest.fn().mockResolvedValue({ acknowledged: true, insertedId: 'someId' }),
      }),
    });

    const req = { body: mockTeacher };
    await teacherController.createTeacher(req, mockRes);

    expect(mockStatus).toHaveBeenCalledWith(201);
    expect(mockJson).toHaveBeenCalledWith({ acknowledged: true, insertedId: 'someId' });
  });

  it('should return 500 if teacher creation fails', async () => {
    mongodb.getDatabase.mockReturnValue({
      collection: () => ({
        insertOne: jest.fn().mockResolvedValue({ acknowledged: false }),
      }),
    });

    const req = { body: {} };
    await teacherController.createTeacher(req, mockRes);

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith('Some error occurred while creating the teacher.');
  });

  it('should return 500 on database error during creation', async () => {
    mongodb.getDatabase.mockImplementation(() => {
      throw new Error('DB connection error');
    });

    const req = { body: {} };
    await teacherController.createTeacher(req, mockRes);

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({ message: 'DB connection error' });
  });
});
