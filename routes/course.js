const express = require('express');
const router = express.Router();
const validation = require('../middleware/validation');

const courseController = require('../controllers/course.js');

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: API for managing courses
 */

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Retrieve a list of courses
 *     tags:
 *       - Courses
 *     responses:
 *       200:
 *         description: A list of courses.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The course ID.
 *                   courseName:
 *                     type: string
 *                     description: The course name.
 *                   courseCode:
 *                     type: string
 *                     description: The course code.
 *                   credits:
 *                     type: number
 *                     description: Number of credits.
 *                   department:
 *                     type: string
 *                     description: The department offering the course.
 *       500:
 *         description: Server error
 */
router.get('/', courseController.getAll);

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Retrieve a single course by ID
 *     tags:
 *       - Courses
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the course to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single course.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 courseName:
 *                   type: string
 *                 courseCode:
 *                   type: string
 *                 credits:
 *                   type: number
 *                 department:
 *                   type: string
 *                 description:
 *                   type: string
 *                 prerequisites:
 *                   type: array
 *                   items:
 *                     type: string
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */
router.get('/:id', courseController.getSingle);

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Create a new course
 *     tags:
 *       - Courses
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseName
 *               - courseCode
 *               - credits
 *               - department
 *             properties:
 *               courseName:
 *                 type: string
 *                 description: The course name.
 *                 example: "Introduction to Computer Science"
 *               courseCode:
 *                 type: string
 *                 description: The course code.
 *                 example: "CSE101"
 *               credits:
 *                 type: number
 *                 description: Number of credits.
 *                 example: 3
 *               department:
 *                 type: string
 *                 description: The department offering the course.
 *                 example: "Computer Science"
 *               description:
 *                 type: string
 *                 description: Course description.
 *                 example: "An introduction to fundamental concepts of computer science."
 *               prerequisites:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of prerequisite courses.
 *                 example: ["MATH101", "PHYS101"]
 *     responses:
 *       201:
 *         description: Course created successfully.
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', validation.validateCourse, courseController.createCourse);

/**
 * @swagger
 * /courses/{id}:
 *   put:
 *     summary: Update an existing course
 *     tags:
 *       - Courses
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the course to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseName:
 *                 type: string
 *               courseCode:
 *                 type: string
 *               credits:
 *                 type: number
 *               department:
 *                 type: string
 *               description:
 *                 type: string
 *               prerequisites:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       204:
 *         description: Course updated successfully.
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */
router.put('/:id', validation.validateCourse, courseController.updateCourse);

/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Delete a course by ID
 *     tags:
 *       - Courses
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the course to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course deleted successfully.
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', courseController.deleteCourse);

module.exports = router;