const express = require('express');
const router = express.Router();
const validation = require('../middleware/validation');

const studentController = require('../controllers/student.js');

/**
 * @swagger
 * tags:
 *   name: Student
 *   description: API for managing students
 */

/**
 * @swagger
 * /student:
 *   get:
 *     summary: Retrieve a list of students
 *     tags:
 *       - Student
 *     responses:
 *       200:
 *         description: A list of students.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The student ID.
 *                   firstName:
 *                     type: string
 *                     description: The student's first name.
 *                   lastName:
 *                     type: string
 *                     description: The student's last name.
 *                   email:
 *                     type: string
 *                     description: The student's email.
 *                   major:
 *                     type: string
 *                     description: The student's major.
 *       500:
 *         description: Server error
 */
router.get('/', studentController.getAll);

/**
 * @swagger
 * /student/{id}:
 *   get:
 *     summary: Retrieve a single student by ID
 *     tags:
 *       - Student
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the student to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single student.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The student ID.
 *                 firstName:
 *                   type: string
 *                   description: The student's first name.
 *                 lastName:
 *                   type: string
 *                   description: The student's last name.
 *                 email:
 *                   type: string
 *                   description: The student's email.
 *                 major:
 *                   type: string
 *                   description: The student's major.
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 */
router.get('/:id', studentController.getSingle);

/**
 * @swagger
 * /student:
 *   post:
 *     summary: Create a new student
 *     tags:
 *       - Student
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - major
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The student's first name.
 *               lastName:
 *                 type: string
 *                 description: The student's last name.
 *               email:
 *                 type: string
 *                 description: The student's email.
 *               major:
 *                 type: string
 *                 description: The student's major.
 *     responses:
 *       201:
 *         description: Student created successfully.
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', validation.validateStudent, studentController.createStudent);

/**
 * @swagger
 * /student/{id}:
 *   put:
 *     summary: Update an existing student
 *     tags:
 *       - Student
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the student to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The student's first name.
 *               lastName:
 *                 type: string
 *                 description: The student's last name.
 *               email:
 *                 type: string
 *                 description: The student's email.
 *               major:
 *                 type: string
 *                 description: The student's major.
 *     responses:
 *       204:
 *         description: Student updated successfully.
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 */
router.put('/:id', validation.validateStudent, studentController.updateStudent);

/**
 * @swagger
 * /student/{id}:
 *   delete:
 *     summary: Delete a student by ID
 *     tags:
 *       - Student
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the student to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student deleted successfully.
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', studentController.deleteStudent);

module.exports = router;
