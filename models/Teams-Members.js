const sequelize = require("../database/config");
const Sequelize = require("sequelize");

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

module.exports = Teams;
