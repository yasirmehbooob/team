const Sequelize = require("sequelize");
module.exports = new Sequelize("postgres", "postgres", "", {
  dialect: "postgres",
});
