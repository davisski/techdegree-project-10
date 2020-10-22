/**
 * @function {handleSequelizeErrors} - Checks if error object is from sequelize validation, then transforms every error into single error array, otherwise throws error.
 * @param {error} - Error object.
 *
 */
const handleSequelizeErrors = (error) => {
  if (
    error.name === "SequelizeValidationError" ||
    error.name === "SequelizeUniqueConstraintError"
  ) {
    error.message = "Bad Request";
    error.status = 400;
    const errors = error.errors.map((err) => err.message);
    error.errors = errors;
    delete error.name;
    return error;
  } else {
    throw error;
  }
};
const createError = (message, status) => {
  const error = new Error();
  error.message = message;
  error.status = status;
  return error;
};

module.exports = {
  handleSequelizeErrors,
  createError,
};
