const express = require('express');
const router = express.Router();
const validation = require('../middleware/validation');

const teacherController = require('../controllers/teacher');

/**
 * @swagger
 * tags:
 *   name: Teacher
 *   description: API for managing teachers
 */

/**
 * @swagger
 * /teacher:
 *   get:
 *     summary: Retrieve a list of teachers
 *     tags:
 *       - Teacher
 *     responses:
 *       200:
 *         description: A list of teachers.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The teacher ID.
 *                   firstName:
 *                     type: string
 *                     description: The teacher's first name.
 *                   lastName:
 *                     type: string
 *                     description: The teacher's last name.
 *                   email:
 *                     type: string
 *                     description: The teacher's email.
 *                   department:
 *                     type: string
 *                     description: The teacher's department.
 *       500:
 *         description: Server error
 */
router.get('/', teacherController.getAll);

/**
 * @swagger
 * /teacher/{id}:
 *   get:
 *     summary: Retrieve a single teacher by ID
 *     tags:
 *       - Teacher
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the teacher to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single teacher.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The teacher ID.
 *                 firstName:
 *                   type: string
 *                   description: The teacher's first name.
 *                 lastName:
 *                   type: string
 *                   description: The teacher's last name.
 *                 email:
 *                   type: string
 *                   description: The teacher's email.
 *                 department:
 *                   type: string
 *                   description: The teacher's department.
 *       404:
 *         description: Teacher not found
 *       500:
 *         description: Server error
 */
router.get('/:id', teacherController.getSingle);

/**
 * @swagger
 * /teacher:
 *   post:
 *     summary: Create a new teacher
 *     tags:
 *       - Teacher
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
 *               - department
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The teacher's first name.
 *               lastName:
 *                 type: string
 *                 description: The teacher's last name.
 *               email:
 *                 type: string
 *                 description: The teacher's email.
 *               department:
 *                 type: string
 *                 description: The teacher's department.
 *     responses:
 *       201:
 *         description: Teacher created successfully.
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', validation.validateTeacher, teacherController.createTeacher);

/**
 * @swagger
 * /teacher/{id}:
 *   put:
 *     summary: Update an existing teacher
 *     tags:
 *       - Teacher
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the teacher to update.
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
 *                 description: The teacher's first name.
 *               lastName:
 *                 type: string
 *                 description: The teacher's last name.
 *               email:
 *                 type: string
 *                 description: The teacher's email.
 *               department:
 *                 type: string
 *                 description: The teacher's department.
 *               hireDate:
 *                 type: string
 *                 format: date
 *                 description: The teacher's hire date (YYYY-MM-DD).
 *     responses:
 *       204:
 *         description: Teacher updated successfully.
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Teacher not found
 *       500:
 *         description: Server error
 */
router.put('/:id', validation.validateTeacher, teacherController.updateTeacher);

/**
 * @swagger
 * /teacher/{id}:
 *   delete:
 *     summary: Delete a teacher by ID
 *     tags:
 *       - Teacher
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the teacher to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Teacher deleted successfully.
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Teacher not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', teacherController.deleteTeacher);

module.exports = router;
