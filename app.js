const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Sequelize = require('sequelize');
const app = express();

const port = process.env.PORT;



app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
});