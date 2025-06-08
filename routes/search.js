const express = require("express");
const { Op } = require("sequelize");
const { Book } = require("../models");

const router = express.Router();

router.get("/", async (req, res) => {
    const { q } = req.query;
    if (!q) return res.status(400).send("Query is required");

    const books = await Book.findAll({
        where: {
            [Op.or]: [
                { title: { [Op.iLike]: `%${q}%` } },
                { author: { [Op.iLike]: `%${q}%` } },
            ],
        },
    });

    res.send(books);
});

module.exports = { router };
