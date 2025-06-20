const courseController = require('../controllers/course');
const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

jest.mock('../db/connect');

const mockJson = jest.fn();
const mockStatus = jest.fn(() => ({ json: mockJson, send: jest.fn() }));
const mockRes = { status: mockStatus, setHeader: jest.fn() };

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Course Controller - getAll', () => {
  it('should return 200 and a list of courses', async () => {
    const mockCourses = [
      { courseName: 'Introduction to Computer Science', courseCode: 'CSE101' },
      { courseName: 'Data Structures', courseCode: 'CSE102' }
    ];

    mongodb.getDatabase.mockReturnValue({
      collection: () => ({
        find: () => ({
          toArray: () => Promise.resolve(mockCourses),
        }),
      }),
    });

    await courseController.getAll({}, mockRes);

    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith(mockCourses);
  });

  it('should return 500 if database fails', async () => {
    mongodb.getDatabase.mockImplementation(() => {
      throw new Error('DB error');
    });

    await courseController.getAll({}, mockRes);

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({ message: 'DB error' });
  });
});

describe('Course Controller - getSingle', () => {
  it('should return 200 and a single course if found', async () => {
    const mockCourse = { 
      _id: new ObjectId(), 
      courseName: 'Advanced Programming',
      courseCode: 'CSE341'
    };
    const req = { params: { id: mockCourse._id.toHexString() } };

    mongodb.getDatabase.mockReturnValue({
      collection: () => ({
        find: () => ({
          toArray: () => Promise.resolve([mockCourse]),
        }),
      }),
    });

    await courseController.getSingle(req, mockRes);

    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith(mockCourse);
  });

  it('should return 404 if course is not found', async () => {
    const req = { params: { id: new ObjectId().toHexString() } };

    mongodb.getDatabase.mockReturnValue({
      collection: () => ({
        find: () => ({
          toArray: () => Promise.resolve([]),
        }),
      }),
    });

    await courseController.getSingle(req, mockRes);

    expect(mockStatus).toHaveBeenCalledWith(404);
    expect(mockJson).toHaveBeenCalledWith({ message: 'Course not found' });
  });

  it('should return 500 if ObjectId is invalid or other error occurs', async () => {
    const req = { params: { id: 'invalid-id' } };

    await courseController.getSingle(req, mockRes);

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.any(String) })
    );
  });
});

describe('Course Controller - createCourse', () => {
  it('should create a new course with status 201', async () => {
    const mockCourse = {
      courseName: 'Test Course',
      courseCode: 'TEST101',
      credits: 3,
      department: 'Computer Science',
      description: 'A test course',
      prerequisites: ['MATH101'],
    };

    mongodb.getDatabase.mockReturnValue({
      collection: () => ({
        insertOne: jest.fn().mockResolvedValue({ acknowledged: true, insertedId: 'someId' }),
      }),
    });

    const req = { body: mockCourse };
    await courseController.createCourse(req, mockRes);

    expect(mockStatus).toHaveBeenCalledWith(201);
    expect(mockJson).toHaveBeenCalledWith({ acknowledged: true, insertedId: 'someId' });
  });

  it('should return 500 if course creation fails', async () => {
    mongodb.getDatabase.mockReturnValue({
      collection: () => ({
        insertOne: jest.fn().mockResolvedValue({ acknowledged: false }),
      }),
    });

    const req = { body: {} };
    await courseController.createCourse(req, mockRes);

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({ message: 'Failed to create course' });
  });
});

describe('Course Controller - updateCourse', () => {
  it('should update a course with status 204', async () => {
    const courseId = new ObjectId();
    const mockCourse = {
      courseName: 'Updated Course',
      courseCode: 'UPD101',
      credits: 4,
      department: 'Computer Science',
    };

    mongodb.getDatabase.mockReturnValue({
      collection: () => ({
        replaceOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
      }),
    });

    const req = { params: { id: courseId.toHexString() }, body: mockCourse };
    await courseController.updateCourse(req, mockRes);

    expect(mockStatus).toHaveBeenCalledWith(204);
  });

  it('should return 404 if course not found during update', async () => {
    const courseId = new ObjectId();

    mongodb.getDatabase.mockReturnValue({
      collection: () => ({
        replaceOne: jest.fn().mockResolvedValue({ modifiedCount: 0 }),
      }),
    });

    const req = { params: { id: courseId.toHexString() }, body: {} };
    await courseController.updateCourse(req, mockRes);

    expect(mockStatus).toHaveBeenCalledWith(404);
    expect(mockJson).toHaveBeenCalledWith({ message: 'Course not found' });
  });

  it('should return 500 on database error during update', async () => {
    mongodb.getDatabase.mockImplementation(() => {
      throw new Error('DB connection error');
    });

    const req = { params: { id: new ObjectId().toHexString() }, body: {} };
    await courseController.updateCourse(req, mockRes);

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({ message: 'DB connection error' });
  });
});

describe('Course Controller - deleteCourse', () => {
  it('should delete a course with status 200', async () => {
    const courseId = new ObjectId();

    mongodb.getDatabase.mockReturnValue({
      collection: () => ({
        deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
      }),
    });

    const req = { params: { id: courseId.toHexString() } };
    await courseController.deleteCourse(req, mockRes);

    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith({ message: 'Course deleted successfully' });
  });

  it('should return 404 if course not found during deletion', async () => {
    const courseId = new ObjectId();

    mongodb.getDatabase.mockReturnValue({
      collection: () => ({
        deleteOne: jest.fn().mockResolvedValue({ deletedCount: 0 }),
      }),
    });

    const req = { params: { id: courseId.toHexString() } };
    await courseController.deleteCourse(req, mockRes);

    expect(mockStatus).toHaveBeenCalledWith(404);
    expect(mockJson).toHaveBeenCalledWith({ message: 'Course not found' });
  });

  it('should return 500 on database error during deletion', async () => {
    mongodb.getDatabase.mockImplementation(() => {
      throw new Error('DB connection error');
    });

    const req = { params: { id: new ObjectId().toHexString() } };
    await courseController.deleteCourse(req, mockRes);

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({ message: 'DB connection error' });
  });
});