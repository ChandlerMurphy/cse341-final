const express = require('express');
const router = express.Router();

const isAuthenticated = require('../middleware/isAuthenticated');

router.get('/', isAuthenticated, (req, res) => {
  res.send('Welcome to the Products API');
});

router.use('/courses', require('./course'));

router.use('/semesters', require('./semester'));

router.use('/student', require('./student'));

router.use('/teacher', require('./teacher'));

router.use('/users', require('./user'));

module.exports = router;
