const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

// Get all semesters
const getAll = async (req, res) => {
  //#swagger.tags=['semesters']
  try {
    const result = await mongodb
      .getDatabase()
      .collection('semester')
      .find();
    const semesters = await result.toArray();
    res.status(200).json(semesters);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: err.message || 'Error retrieving semesters' });
  }
};

// Get a single semester
const getSingle = async (req, res) => {
  //#swagger.tags=['semesters']
  try {
    const semesterId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDatabase()
      .collection('semester')
      .find({ _id: semesterId });
    const semester = await result.toArray();
    if (semester.length > 0) {
      res.status(200).json(semester[0]);
    } else {
      res.status(404).json({ message: 'Semester not found' });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: err.message || 'Error retrieving semester' });
  }
};

// Create a new semester
const createSemester = async (req, res) => {
  //#swagger.tags=['semesters']
  try {
    const semester = {
      year: req.body.year,
      semesterSeason: req.body.semesterSeason,
      semesterStart: req.body.semesterStart,
      semesterEnd: req.body.semesterEnd,
    };
    const response = await mongodb
      .getDatabase()
      .collection('semester')
      .insertOne(semester);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json({ message: 'Failed to create semester' });
    }
  } catch (err) {
    console.error('Create semester failed:', err);
    res.status(500).json({ message: err.message || 'Error creating semester' });
  }
};

// Update a semester
const updateSemester = async (req, res) => {
  //#swagger.tags=['semesters']
  try {
    const semesterId = new ObjectId(req.params.id);
    const semester = {
      year: req.body.year,
      semesterSeason: req.body.semesterSeason,
      semesterStart: req.body.semesterStart,
      semesterEnd: req.body.semesterEnd,
    };
    const response = await mongodb
      .getDatabase()
      .collection('semester')
      .replaceOne({ _id: semesterId }, semester);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'semester not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Error updating semester' });
  }
};

// Delete semester
const deleteSemester = async (req, res) => {
  //#swagger.tags=['semesters']
  try {
    const semesterId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDatabase()
      .collection('semester')
      .deleteOne({ _id: semesterId });
    if (response.deletedCount > 0) {
      res.status(200).json({ message: 'semester deleted' });
    } else {
      res.status(404).json({ message: 'semester not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Error deleting semester' });
  }
};

module.exports = {
  getAll,
  getSingle,
  createSemester,
  updateSemester,
  deleteSemester,
};
