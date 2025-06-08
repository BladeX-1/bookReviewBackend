const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const path = require("path");

const router = express.Router();

router.get("/", (req, res) => {
    res.render("login.ejs");
});

router.post("/", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password)
        return res.status(400).send("Username and password are required");

    try {
        const user = await User.findOne({ where: { username } });
        if (!user) return res.status(401).send("Invalid credentials");

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return res.status(401).send("Invalid credentials");

        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h",
            }
        );
        res.cookie("login", token, { expires: "1h" });
        res.redirect("/");
    } catch (error) {
        res.status(500).send("Server error");
    }
});

module.exports = { router };
