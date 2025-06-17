function validateSemesterYear(year) {
  return /^\d{4}$/.test(year) ? true : 'Year must be a 4-digit number';
}

function validateSemesterSeason(semesterSeason) {
  const validSeasons = ['Fall', 'Winter', 'Spring', 'Summer'];
  return validSeasons.includes(semesterSeason)
    ? true
    : 'Semester season must be: Fall, Winter, Spring, or Summer';
}

function validateSemesterStart(semesterStart) {
  return isValidDate(semesterStart) ? true : 'Semester start date is invalid';
}

function validateSemesterEnd(semesterEnd) {
  return isValidDate(semesterEnd) ? true : 'Semester end date is invalid';
}

function isValidDate(dateString) {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

function validateSemester(req, res, next) {
  const { year, semesterSeason, semesterStart, semesterEnd } = req.body;

  const errors = [];

  const yearValid = validateSemesterYear(year);
  const seasonValid = validateSemesterSeason(semesterSeason);
  const startValid = validateSemesterStart(semesterStart);
  const endValid = validateSemesterEnd(semesterEnd);

  if (yearValid !== true) errors.push(yearValid);
  if (seasonValid !== true) errors.push(seasonValid);
  if (startValid !== true) errors.push(startValid);
  if (endValid !== true) errors.push(endValid);

  if (errors.length > 0) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
}

module.exports = {
  validateSemester,
};
