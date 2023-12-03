/*
Name: Brandon Walton
Prof: Krishna Vadrevu
Class: CSC-2610
Date: 12/3/2023
*/

const express = require('express');
const User = require('../models/model');
const router = express.Router();
const session = require('express-session');
module.exports = router;

//Use Sessions to keep track of user
router.use(session({
    secret: 'bwalto8-key',
    resave: false,
    saveUninitialized: true,
}));

//Posting a new user
router.post('/newuser', async (req, res) => {
    console.log("Form submitted");
    const user = new User({
        name: req.body.uname,
        password: req.body.psw
    })
    try {
        const userToSave = await user.save();
        req.session.user = {
            name: user.name,
            password: user.password
            // Add other user data as needed
        };
        res.redirect('/dashboard');
        console.log("Data Stored and Saved:", user.name);
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
});

//Logining in with user
router.post('/user', async (req, res) => {
    const username = req.body.uname;
    const password = req.body.psw;
    console.log("Attempting to login with ", username);
    try {
        const user = await User.findOne({ name: username, password: password });
        if (!user) {
            console.log("Login Failed with User: ", username);
            return res.redirect('/login');
        }
        req.session.user = {
            name: user.name,
            parkinglot: user.parkinglot,
            _id: user._id
            // Add other user data as needed
        };
        res.redirect('/dashboard');
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
});

//Reserving Lot and storing in user
router.post('/reserveLot', async (req, res) => {
    const { name, lotId, ticket, startTime, endTime } = req.body;
    try {
        const user = req.session.user;
        if (!user) {
            console.log("User ID not found in the session");
            return res.redirect('/login');
        }

        
        const userData = await User.findOne({ name: user.name });//For some reason ID  doesnt work, will improve in future 
        if (!userData) {
            console.log("User data not found");
            return res.status(404).send('User data not found');
        }

        userData.parkinglot.push({
            lotname: name,
            id: lotId,
            ticketID: ticket,
            startTime: startTime,
            endTime, endTime,
        });

        await userData.save();
        res.json({
            lotname: name,
            id: lotId,
            ticketID: ticket,
            startTime: startTime,
            endTime: endTime,
        });
        console.log("Data base updated for user: ", user);
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}
);

//redirect to signup
router.get('/signup', (req, res) => {
    res.render('signup');
});
//redirect to availability
router.get('/availability', (req, res) => {
    res.render('availability');
});

//Scrapes information from parkinginfo for avialaibilty page
router.get('/parkinginfo', (req, res) => {
    res.render('parkinginfo');

});

//redirect to dashboard
router.get('/dashboard', (req, res) => {
    try {
        console.log('Visited website');
        const user = req.session.user;
        console.log('User data:', user);
        res.render('home', { user: user });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

//redirect to login
router.get('/login', (req, res) => {
    res.render('login');
});

//redirect to signout
router.get('/signout', async (req, res) => {
    res.render('login')
});

//delete all users
router.get('/deleteAll', async (req, res) => {
    try {
        await User.deleteMany({});
        res.status(200).json({ message: 'All users deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});