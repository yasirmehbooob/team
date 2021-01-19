const sequelize = require("./../database/config");
const Sequelize = require("sequelize");
const Members = require("./Users");
const TeamMembers = require("./TeamMembers");

const Teams = sequelize.define(
  "teams",
  {
    name: {
      field: "name",
      type: Sequelize.STRING,
    },
    discription: {
      field: "discription",
      type: Sequelize.STRING,
    },
    tags: {
      field: "tags",
      type: Sequelize.STRING,
    },
    is_deleted: {
      field: "is_deleted",
      type: Sequelize.STRING,
    },
  },
  {
    timestamps: false,
  }
);

Teams.belongsToMany(Members, {
  through: TeamMembers,
  foreignKey: "teamId",
  timestamps: false,
});
module.exports = Teams;
