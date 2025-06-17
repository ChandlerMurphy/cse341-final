const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res, next) => {
  try {
    const result = await mongodb.getDatabase().collection('teachers').find();
    result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message:
          error.message || 'Some error occurred while retrieving teachers.',
      });
  }
};

const getSingle = async (req, res, next) => {
  try {
    const userId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDatabase()
      .collection('teachers')
      .find({ _id: userId });
    result.toArray().then((lists) => {
      if (lists.length === 0) {
        res.status(404).json({ message: 'Teacher not found' });
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(lists[0]);
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message:
          error.message || 'Some error occurred while retrieving the teacher.',
      });
  }
};

const createTeacher = async (req, res, next) => {
  try {
    const teacher = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      department: req.body.department,
      hireDate: req.body.hireDate,
    };
    const response = await mongodb
      .getDatabase()
      .collection('teachers')
      .insertOne(teacher);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json('Some error occurred while creating the teacher.');
    }
  } catch (error) {
    res
      .status(500)
      .json({
        message:
          error.message || 'Some error occurred while creating the teacher.',
      });
  }
};

const updateTeacher = async (req, res, next) => {
  try {
    const userId = new ObjectId(req.params.id);
    const teacher = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      department: req.body.department,
      hireDate: req.body.hireDate,
    };
    const response = await mongodb
      .getDatabase()
      .collection('teachers')
      .replaceOne({ _id: userId }, teacher);
    if (response.modifiedCount > 0) {
      res.status(204).json(response);
    } else {
      res.status(500).json('Some error occurred while updating the teacher.');
    }
  } catch (error) {
    res
      .status(500)
      .json({
        message:
          error.message || 'Some error occurred while updating the teacher.',
      });
  }
};

const deleteTeacher = async (req, res, next) => {
  try {
    const userId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDatabase()
      .collection('teachers')
      .deleteOne({ _id: userId });
    if (response.deletedCount > 0) {
      res.status(200).json(response);
    } else {
      res.status(500).json('Some error occurred while deleting the teacher.');
    }
  } catch (error) {
    res
      .status(500)
      .json({
        message:
          error.message || 'Some error occurred while deleting the teacher.',
      });
  }
};

module.exports = {
  getAll,
  getSingle,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};
