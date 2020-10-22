const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
/**
 * @extends {Users} - Extends Sequelize Model with all properties to it, and implemented validation for firstName, lastName, emailAddress and password.
 *
 */
module.exports = (sequelize) => {
  class Users extends Model {}
  Users.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "First name field is required!",
          },
          notNull: {
            msg: "First name field is required!",
          },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Last name field is required!",
          },
          notNull: {
            msg: "Last name field is required!",
          },
        },
      },
      emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Sorry the email you entered already exists in database!",
        },
        validate: {
          notEmpty: {
            msg: "Email field is required!",
          },
          isEmail: {
            msg: "Please provide a correct email address!",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Password field is required!",
          },
          notNull: {
            msg: "Password field is required!",
          },
        },
        set(val) {
          if (val) {
            const hashedPassword = bcrypt.hashSync(val, 10);
            this.setDataValue("password", hashedPassword);
          }
        },
      },
    },
    { sequelize }
  );
  Users.associate = (models) => {
    Users.hasMany(models.Courses, {
      as: "user",
      foreignKey: {
        fieldName: "userId",
        allowNull: false,
      },
    });
  };
  return Users;
};
