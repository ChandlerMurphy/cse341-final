const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

const getAll = async (req, res) => {
  //#swagger.tags=['courses']
  try {
    const result = await mongodb
      .getDatabase()
      .collection('courses')
      .find();
    const courses = await result.toArray();
    res.status(200).json(courses);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: err.message || 'Error retrieving courses' });
  }
};

const getSingle = async (req, res) => {
  //#swagger.tags=['courses']
  try {
    const courseId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDatabase()
      .collection('courses')
      .find({ _id: courseId });
    const courses = await result.toArray();
    if (courses.length > 0) {
      res.status(200).json(courses[0]);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: err.message || 'Error retrieving course' });
  }
};

const createCourse = async (req, res) => {
  //#swagger.tags=['courses']
  try {
    const course = {
      courseName: req.body.courseName,
      courseCode: req.body.courseCode,
      credits: req.body.credits,
      department: req.body.department,
      description: req.body.description,
      prerequisites: req.body.prerequisites || [],
    };
    const response = await mongodb
      .getDatabase()
      .collection('courses')
      .insertOne(course);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json({ message: 'Failed to create course' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Error creating course' });
  }
};

const updateCourse = async (req, res) => {
  //#swagger.tags=['courses']
  try {
    const courseId = new ObjectId(req.params.id);
    const course = {
      courseName: req.body.courseName,
      courseCode: req.body.courseCode,
      credits: req.body.credits,
      department: req.body.department,
      description: req.body.description,
      prerequisites: req.body.prerequisites || [],
    };
    const response = await mongodb
      .getDatabase()
      .collection('courses')
      .replaceOne({ _id: courseId }, course);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Error updating course' });
  }
};

const deleteCourse = async (req, res) => {
  //#swagger.tags=['courses']
  try {
    const courseId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDatabase()
      .collection('courses')
      .deleteOne({ _id: courseId });
    if (response.deletedCount > 0) {
      res.status(200).json({ message: 'Course deleted successfully' });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Error deleting course' });
  }
};

module.exports = {
  getAll,
  getSingle,
  createCourse,
  updateCourse,
  deleteCourse,
};