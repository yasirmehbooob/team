const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Sequelize = require('sequelize');
const app = express();

const port = process.env.PORT || 8000;

const sequelize = new Sequelize("mydatabase","postgres","",{ dialect: 'postgres'});

app.get('/api/users', (req, res) => {
    sequelize.findAll().then((err, users) => {
        if(err) {
            res.send('error occour' + err);
        }

        res.send(users);
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
});