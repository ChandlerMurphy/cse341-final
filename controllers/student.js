const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

// Get all students
const getAll = async (req, res) => {
  //#swagger.tags=['students']
  try {
    const result = await mongodb
      .getDatabase()
      .collection('student')
      .find();
    const students = await result.toArray();
    res.status(200).json(students);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: err.message || 'Error retrieving students' });
  }
};

// Get a single student
const getSingle = async (req, res) => {
  //#swagger.tags=['Students']
  try {
    const studentId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDatabase()
      .collection('student')
      .find({ _id: studentId });
    const students = await result.toArray();
    if (students.length > 0) {
      res.status(200).json(students[0]);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: err.message || 'Error retrieving student' });
  }
};

// Create a new student
const createStudent = async (req, res) => {
  //#swagger.tags=['students']
  try {
    const student = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      birthday: req.body.birthday,
      email: req.body.email,
      phoneNum: req.body.phoneNum,
      address: req.body.address,
    };
    const response = await mongodb
      .getDatabase()
      .collection('student')
      .insertOne(student);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json({ message: 'Failed to create student' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Error creating student' });
  }
};

// Update a student
const updateStudent = async (req, res) => {
  //#swagger.tags=['students']
  try {
    const studentId = new ObjectId(req.params.id);
    const student = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      birthday: req.body.birthday,
      email: req.body.email,
      phoneNum: req.body.phoneNum,
      address: req.body.address,
    };
    const response = await mongodb
      .getDatabase()
      .collection('student')
      .replaceOne({ _id: studentId }, student);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Error updating student' });
  }
};

// Delete student
const deleteStudent = async (req, res) => {
  //#swagger.tags=['students']
  try {
    const studentId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDatabase()
      .collection('student')
      .deleteOne({ _id: studentId });
    if (response.deletedCount > 0) {
      res.status(200).json({ message: 'student deleted' });
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Error deleting student' });
  }
};

module.exports = {
  getAll,
  getSingle,
  createStudent,
  updateStudent,
  deleteStudent,
  getAll,
  getSingle,
  createStudent,
  updateStudent,
  deleteStudent,
};
