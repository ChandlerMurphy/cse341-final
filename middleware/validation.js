const Joi = require('joi');

const studentSchema = Joi.object({
  firstName: Joi.string().min(1).max(100).required(),
  lastName: Joi.string().min(1).max(100).required(),
  email: Joi.string().email().required(),
  major: Joi.string().min(1).max(100).required(),
});

const teacherSchema = Joi.object({
  firstName: Joi.string().min(1).max(100).required(),
  lastName: Joi.string().min(1).max(100).required(),
  email: Joi.string().email().required(),
  department: Joi.string().min(1).max(100).required(),
  hireDate: Joi.date().iso().required(),
});

const courseSchema = Joi.object({
  courseName: Joi.string().min(1).max(200).required(),
  courseCode: Joi.string().min(3).max(20).required(),
  credits: Joi.number().integer().min(1).max(6).required(),
  department: Joi.string().min(1).max(100).required(),
  description: Joi.string().min(10).max(1000).optional(),
  prerequisites: Joi.array().items(Joi.string().min(3).max(20)).optional(),
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = {
  validateStudent: validate(studentSchema),
  validateTeacher: validate(teacherSchema),
  validateCourse: validate(courseSchema),
};