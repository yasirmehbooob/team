const sequelize = require("./../database/config");
const Sequelize = require("sequelize");

module.exports = sequelize.define(
  "team_members",
  {
    teamId: {
      field: "teamId",
      type: Sequelize.INTEGER,
    },
    userId: {
      field: "userId",
      type: Sequelize.INTEGER,
    },
  },
  {
    timestamps: false,
  }
);
