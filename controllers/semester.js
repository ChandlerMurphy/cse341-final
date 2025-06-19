const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

/**
 * Get all semesters.
 * @swagger tags: ['semesters']
 */
const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDatabase().collection('semester').find();
    const semesters = await result.toArray();
    res.status(200).json(semesters);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Error retrieving semesters' });
  }
};

/**
 * Get a single semester by ID.
 * @swagger tags: ['semesters']
 */
const getSingle = async (req, res) => {
  try {
    const semesterId = new ObjectId(req.params.id);
    const semester = await mongodb
      .getDatabase()
      .collection('semester')
      .findOne({ _id: semesterId });

    if (semester) {
      res.status(200).json(semester);
    } else {
      res.status(404).json({ message: 'Semester not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Error retrieving semester' });
  }
};

/**
 * Create a new semester.
 * @swagger tags: ['semesters']
 */
const createSemester = async (req, res) => {
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

/**
 * Update a semester by ID.
 * @swagger tags: ['semesters']
 */
const updateSemester = async (req, res) => {
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
      res.status(404).json({ message: 'Semester not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Error updating semester' });
  }
};

/**
 * Delete a semester by ID.
 * @swagger tags: ['semesters']
 */
const deleteSemester = async (req, res) => {
  try {
    const semesterId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDatabase()
      .collection('semester')
      .deleteOne({ _id: semesterId });

    if (response.deletedCount > 0) {
      res.status(200).json({ message: 'Semester deleted successfully' });
    } else {
      res.status(404).json({ message: 'Semester not found' });
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