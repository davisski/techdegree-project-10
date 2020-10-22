const Courses = require("../models").Courses;
const Users = require("../models").Users;
const { asyncHandler } = require("../helpers");
const {
  handleSequelizeErrors,
  createError,
} = require("../helpers/error-handle");

/**
 * @constant {coursesController} - Courses route controller.
 * @method {all} - Retrieves all courses from database.
 * @method {create} - Create new course.
 * @method {retrieveIndividual} - Get individual course by its id.
 * @method {update} - To edit course.
 * @method {delete} - To delete course.
 */
const coursesController = {
  all: asyncHandler(async (req, res, next) => {
    try {
      const courses = await Courses.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          {
            model: Users,
            as: "user",
            attributes: { exclude: ["password", "createdAt", "updatedAt"] },
          },
        ],
      });
      res.status(200).json({ courses });
    } catch (error) {
      next(error);
    }
  }),
  create: asyncHandler(async (req, res, next) => {
    try {
      const course = await Courses.create({
        title: req.body.title,
        description: req.body.description,
        estimatedTime: req.body.estimatedTime,
        materialsNeeded: req.body.materialsNeeded,
        userId: req.currentUser.id,
      });
      res.location(`/courses/${course.id}`)
      res.status(201).send();
    } catch (error) {
      const errors = handleSequelizeErrors(error);
      next(errors);
    }
  }),
  retrieveIndividual: asyncHandler(async (req, res, next) => {
    try {
      const course = await Courses.findOne({
        include: [
          {
            model: Users,
            as: "user",
            attributes: { exclude: ["password", "createdAt", "updatedAt"] },
          },
        ],
        attributes: { exclude: ["createdAt", "updatedAt"]},
        where: {
          id: req.params.id,
        },
      });
      course ? res.status(200).json({ course }) : next();
    } catch (error) {
      next(error);
    }
  }),
  update: asyncHandler(async (req, res, next) => {
    try {
      const course = await Courses.findOne({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        where: {
          id: req.params.id,
        },
      });
      if (course.userId === req.currentUser.id) {
        course.title = req.body.title;
        course.description = req.body.description;
        if(req.body.estimatedTime || req.body.materialsNeeded){
          course.estimatedTime = req.body.estimatedTime;
          course.materialsNeeded = req.body.materialsNeeded;
        }
        await course.save()
        res.status(204).send();
        
      } else {
        const error = createError(
          "Access to the requested resource is forbidden",
          403
        );
        next(error);
      }
    } catch (error) {
      const errors = handleSequelizeErrors(error);
      next(errors);
    }
  }),
  delete: asyncHandler(async (req, res, next) => {
    try {
      const course = await Courses.findOne({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        where: {
          id: req.params.id,
        },
      });
      if (course.userId === req.currentUser.id) {
        await course.destroy();
        res.status(204).send();
      } else {
        const error = createError(
          "Access to the requested resource is forbidden",
          403
        );
        next(error);
      }
    } catch (error) {
      next(error);
    }
  }),
};

module.exports = coursesController;
