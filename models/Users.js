const sequelize = require("./../database/config");
const Sequelize = require("sequelize");
const Teams = require("./Teams-Members");
const TeamMembers = require("./TeamMembers");

const Members = sequelize.define(
  "users",
  {
    first_name: {
      field: "first_name",
      type: Sequelize.STRING,
    },
    last_name: {
      field: "last_name",
      type: Sequelize.STRING,
    },
    email: {
      field: "email",
      type: Sequelize.STRING,
    },
    password: {
      field: "password",
      type: Sequelize.STRING,
    },
    designation: {
      field: "designation",
      type: Sequelize.STRING,
    },
    phone_num: {
      field: "phone_num",
      type: Sequelize.STRING,
    },
    image: {
      field: "image",
      type: Sequelize.STRING,
    },
    resume: {
      field: "resume",
      type: Sequelize.STRING,
    },
  },
  {
    timestamps: false,
  }
);

Members.belongsToMany(Teams, {
  through: TeamMembers,
  foreignKey: "userId",
  timestamps: false,
});

module.exports = Members;
