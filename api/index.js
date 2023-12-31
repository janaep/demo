/*this is what is gonna help our login and register actually work */

const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const User = require('./models/User');
const bcrypt = require ('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const salt = bcrypt.genSaltSync(10);
const secret = 'fhasygfchaooisnvijsnvj';

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());

mongoose.connect('mongodb+srv://app0:TIQv5JrbRRrvpIa0@cluster0.vcwbp0g.mongodb.net/?retryWrites=true&w=majority');

app.post('/register', async (req,res) => {
    const {username, password} = req.body;
    try{
        const userDoc = await User.create({
            username,
            password:bcrypt.hashSync(password, salt),
        });
        res.json(userDoc);
    } catch(e) {
        console.log(e);
        res.status(400).json(e);
    }
});

app.post('/login', async (req,res) => {
    const {username,password} = req.body;
    const userDoc = await User.findOne({username});
    const passOk = bcrypt.compareSync(password, userDoc.password);

    if (passOk) {
        //logged in
        jwt.sign({username,id:userDoc._id}, secret, {}, (err,token) => {
            if (err) throw err;
            // res.cookie('token', token).json('ok');
            res.json(token);
        });
    } else {
        res.status(400).json('wrong credientials');
    }
});

app.get('/profile', (req,res) => {
    const {token} = req.cookies;
    console.log(token);
    // jwt.verify(token, secret, {}, (err,info) => {
    //    if (err) throw err;  
    //    res.json(info);
    // });
});

app.post('/logout', (req,res) => {
    res.cookie('token', '').json('ok');
})

app.listen(4000);

//TIQv5JrbRRrvpIa0