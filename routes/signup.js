const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../models");

const router = express.Router();

router.get("/", (req, res) => {
    res.render("signup.ejs");
});

router.post("/", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res.status(400).send("Username and password are required");

    try {
        // checks if user already exists
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) return res.status(400).send("Username already taken");

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username,
            password: hashedPassword,
        });

        res.status(201).redirect("/login");
    } catch (error) {
        res.status(500).send("Server error");
    }
});

module.exports = { router };
