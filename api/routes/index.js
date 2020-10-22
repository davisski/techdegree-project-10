const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const coursesController = require("../controllers/coursesController");
const { authenticate } = require("../helpers/auth");
const { createError } = require("../helpers/error-handle");
// setup a friendly greeting for the root route
router.get("/", (req, res) => {
  res.json({
    message: "Welcome to the REST API project!",
  });
});

/**
 * Users routes
 */
router.get("/users", authenticate, userController.all);
router.post("/users", userController.create);

/**
 * Courses routes
 * @param {id} - Specific identifier for a course.
 */

router.get("/courses", coursesController.all);
router.post("/courses", authenticate, coursesController.create);

router.put("/courses/:id", authenticate, coursesController.update);
router.get("/courses/:id", coursesController.retrieveIndividual);
router.delete("/courses/:id", authenticate, coursesController.delete);

module.exports = router;
