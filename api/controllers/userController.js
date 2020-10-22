"use strict";
const Users = require("../models").Users;
const { asyncHandler } = require("../helpers");
const { handleSequelizeErrors } = require("../helpers/error-handle");

/**
 * @constant {userController} - User route controller.
 * @method {all} - Retrieve current user.
 * @method {create} - Create new user.
 */
const userController = {
  all: asyncHandler(async (req, res, next) => {
    try {
      const user = await Users.findOne({
        attributes: { exclude: ["password","createdAt", "updatedAt"] },
        where: {
          id: req.currentUser.id,
        },
      });
      res.json({ user });
    } catch (error) {
      error.status = 401;
      next(error);
    }
  }),
  create: asyncHandler(async (req, res, next) => {
    try {
      await Users.create(req.body);
      res.location("/");
      res.status(201).send();
    } catch (error) {
      console.log("ERROR: ", error.name);
      const errors = handleSequelizeErrors(error);
      next(errors);
    }
  }),
};

module.exports = userController;
