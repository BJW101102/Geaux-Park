/*
Name: Brandon Walton
Prof: Krishna Vadrevu
Class: CSC-2610
Date: 12/3/2023
*/

const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); // Include the 'path' module

const app = express();


//Accepting Json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//Setting Static Directories
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'controllers')));

//Default Route
app.get('/', (req, res) => {
    res.render('login');
});

//Connecting to Database
require('dotenv').config();
const mongoString = process.env.DATABASE_URL;
mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error',(error) => {
    console.log(error);
})

database.once('connected', () =>{
    console.log('Database Connected');
})

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`);
})

const routes = require('./routes/routes');
app.use('/', routes); 



