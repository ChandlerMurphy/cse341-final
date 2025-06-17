const semesterController = require('../controllers/semester');
const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

jest.mock('../db/connect');

const mockJson = jest.fn();
const mockStatus = jest.fn(() => ({ json: mockJson }));
const mockRes = { status: mockStatus, setHeader: jest.fn() };

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Semester Controller - getAll', () => {
  it('should return 200 and a list of semesters', async () => {
    const mockSemesters = [{ year: '2025' }, { year: '2024' }];

    mongodb.getDatabase.mockReturnValue({
      collection: () => ({
        find: () => ({
          toArray: () => Promise.resolve(mockSemesters),
        }),
      }),
    });

    await semesterController.getAll({}, mockRes);

    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith(mockSemesters);
  });

  it('should return 500 if database fails', async () => {
    mongodb.getDatabase.mockImplementation(() => {
      throw new Error('DB down');
    });

    await semesterController.getAll({}, mockRes);

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({ message: 'DB down' });
  });
});

describe('Semester Controller - getSingle', () => {
  it('should return 200 and a single semester if found', async () => {
    const mockSemester = { _id: new ObjectId(), year: '2025' };
    const req = { params: { id: mockSemester._id.toHexString() } };

    mongodb.getDatabase.mockReturnValue({
      collection: () => ({
        find: () => ({
          toArray: () => Promise.resolve([mockSemester]),
        }),
      }),
    });

    await semesterController.getSingle(req, mockRes);

    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith(mockSemester);
  });

  it('should return 404 if semester not found', async () => {
    const req = { params: { id: new ObjectId().toHexString() } };

    mongodb.getDatabase.mockReturnValue({
      collection: () => ({
        find: () => ({
          toArray: () => Promise.resolve([]),
        }),
      }),
    });

    await semesterController.getSingle(req, mockRes);

    expect(mockStatus).toHaveBeenCalledWith(404);
    expect(mockJson).toHaveBeenCalledWith({ message: 'Semester not found' });
  });

  it('should return 500 for invalid ObjectId or other errors', async () => {
    const req = { params: { id: 'invalid-id' } };

    await semesterController.getSingle(req, mockRes);

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.any(String) })
    );
  });
});
