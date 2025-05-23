const express = require('express');
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

var router = express.Router();

router.post("/register", async (req, res) => {
    let user = req.body;
    if (!user || !user.username || !user.password) {
        return res.status(400).send("please enter valid user");
    }
    let userinDb = await User.findOne({ username: user.username });
    if (userinDb) {
        return res.status(400).send("user already excists");
    }
    let lastUser = await User.findOne().sort({ id: -1 }).limit(1);
    let newId = lastUser ? lastUser.id + 1 : 1;
    let hasedPassword = await bcrypt.hash(user.password, 10);
    var newUser = new User({
        id: newId,
        username: user.username,
        password: hasedPassword,
        role: user.role
    });
    var savedUser = await newUser.save();
    res.status(201).json({ message: "user created successfully", userDetail: { username: savedUser.username, role: savedUser.role } });
});

router.post("/login", async (req, res) => {
    let reqUser = req.body;
    let userinDb = await User.findOne({ username: reqUser.username });
    if (userinDb && bcrypt.compare(reqUser.password, userinDb.password)) {
        let payload = {
            iss: process.env.JWT_ISSUER,
            aud: process.env.JWT_AUDIENCE,
            name: userinDb.username,
            role: userinDb.role,
        };
        let buffer = Buffer.from(process.env.JWT_SECRET, 'utf-8');
        var token = jwt.sign(payload, buffer, {
            expiresIn: process.env.JWT_EXPIRES_IN,
            algorithm: 'HS256'
        });
        return res.status(200).json({ token: token });
    }
    res.status(401).send("username or password Incorrect");
});

module.exports = router;

