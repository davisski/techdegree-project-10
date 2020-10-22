const { Model, DataTypes } = require("sequelize");

/**
 * @extends {Courses} - Extends Sequelize Model with all properties to it, and implemented validation for title and description.
 *
 */
module.exports = (sequelize) => {
  class Courses extends Model {}
  Courses.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Title is required!",
          },
          notNull: {
            msg: "Title is required!",
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Description is required!",
          },
          notNull: {
            msg: "Description is required!",
          },
        },
      },
      estimatedTime: {
        type: DataTypes.STRING,
      },
      materialsNeeded: {
        type: DataTypes.STRING,
      },
    },
    { sequelize }
  );
  Courses.associate = (models) => {
    Courses.belongsTo(models.Users, {
      as: "user",
      foreignKey: {
        fieldName: "userId",
        allowNull: false,
      },
    });
  };
  return Courses;
};
