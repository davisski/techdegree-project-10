const auth = require("basic-auth");
const Users = require("../../models").Users;
const bcrypt = require("bcryptjs");
const { createError } = require("../../helpers/error-handle");

/**
 * @function {authenticate} - App middleware, for user authentification.
 * @param {req} - Request object.
 * @param {res} - Response object.
 * @param {next} - Call to next middleware function.
 */
const authenticate = async (req, res, next) => {
  try {
    const credentials = auth(req);
   
    if (credentials) {
      const user = await Users.findOne({
        where: {
          emailAddress: credentials.name,
        },
      });

      if (user) {
        const authenticated = bcrypt.compareSync(
          credentials.pass,
          user.password
        );

        if (authenticated) {
          req.currentUser = user;
        } else {
          const error = createError(
            `Authentication failure for email: ${user.emailAddress}`,
            401
          );
          next(error);
        }
      } else {
        const error = createError(
          `User not found for email: ${credentials.name}`,
          401
        );
        next(error);
      }
    } else {
      const error = createError("Access Denied", 401);
      next(error);
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authenticate,
};
