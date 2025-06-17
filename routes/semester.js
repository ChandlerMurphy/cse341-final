const express = require('express');
const { validateSemester } = require('../middleware/semesterValidation.js');
const router = express.Router();
const semesterController = require('../controllers/semester.js');

/**
 * @swagger
 * components:
 *   schemas:
 *     Semester:
 *       type: object
 *       required:
 *         - year
 *         - semesterSeason
 *         - semesterStart
 *         - semesterEnd
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the semester
 *         year:
 *           type: string
 *           description: The year of the semester (e.g., 2023)
 *         semesterSeason:
 *           type: string
 *           description: The season of the semester (e.g., Fall, Winter, Spring, Summer)
 *         semesterStart:
 *           type: string
 *           format: date
 *           description: The start date of the semester
 *         semesterEnd:
 *           type: string
 *           format: date
 *           description: The end date of the semester
 *       example:
 *         id: 6527a4a42c6c5d0017000000
 *         year: "2023"
 *         semesterSeason: "Fall"
 *         semesterStart: 2023-09-01
 *         semesterEnd: 2023-12-15
 */

/**
 * @swagger
 * tags:
 *   name: Semesters
 *   description: API for managing semesters
 */

/**
 * @swagger
 * /semesters:
 *   get:
 *     summary: Returns the list of all the semesters
 *     tags: [Semesters]
 *     responses:
 *       200:
 *         description: The list of the semesters
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Semester'
 *       500:
 *         description: Some server error
 */
router.get('/', semesterController.getAll);

/**
 * @swagger
 * /semesters:
 *   post:
 *     summary: Create a new semester
 *     tags: [Semesters]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Semester'
 *           example:
 *             year: "2024"
 *             semesterSeason: "Winter"
 *             semesterStart: 2024-01-08
 *             semesterEnd: 2024-04-20
 *     responses:
 *       201:
 *         description: The semester was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Semester'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Some server error
 */
router.post('/', validateSemester, semesterController.createSemester);

/**
 * @swagger
 * /semesters/{id}:
 *   get:
 *     summary: Get a semester by id
 *     tags: [Semesters]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The semester id
 *     responses:
 *       200:
 *         description: The semester description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Semester'
 *       404:
 *         description: The semester was not found
 *       500:
 *         description: Some server error
 */
router.get('/:id', semesterController.getSingle);

/**
 * @swagger
 * /semesters/{id}:
 *   put:
 *     summary: Update a semester by the id
 *     tags: [Semesters]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The semester id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Semester'
 *           example:
 *             year: "2024"
 *             semesterSeason: "Winter"
 *             semesterStart: 2024-01-08
 *             semesterEnd: 2024-04-25
 *     responses:
 *       200:
 *         description: The semester was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Semester'
 *       400:
 *         description: Bad request
 *       404:
 *         description: The semester was not found
 *       500:
 *         description: Some server error
 */
router.put('/:id', validateSemester, semesterController.updateSemester);

/**
 * @swagger
 * /semesters/{id}:
 *   delete:
 *     summary: Remove the semester by id
 *     tags: [Semesters]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The semester id
 *     responses:
 *       200:
 *         description: The semester was deleted successfully
 *       404:
 *         description: The semester was not found
 *       500:
 *         description: Some server error
 */
router.delete('/:id', semesterController.deleteSemester);

module.exports = router;
