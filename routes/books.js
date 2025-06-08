const express = require("express");
const { authenticate } = require("../helper/authenticate.js");
const { User, Book, Review } = require("../models.js");

const router = express.Router();

// POST /books (Authenticated)
router.post("/", authenticate, async (req, res) => {
    const book = await Book.create(req.body);
    res.status(201).send(book);
});

// GET /books with pagination and filter
router.get("/", async (req, res) => {
    let { page = 1, limit = 10, author, genre } = req.query;

    const where = {};
    if (author) where.author = author;
    if (genre) where.genre = genre;

    const books = await Book.findAll({
        where,
        offset: (page - 1) * limit,
        limit: parseInt(limit),
    });

    res.send(books);
});

// GET /books/:id with average rating and reviews
router.get("/:id", async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).send("Book not found");

    const reviews = await Review.findAll({ where: { BookId: book.id } });
    const avgRating =
        reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1);

    const { page = 1, limit = 5 } = req.query;
    const paginatedReviews = await Review.findAll({
        where: { BookId: book.id },
        include: [{ model: User, attributes: ["username"] }],
        offset: (page - 1) * limit,
        limit: parseInt(limit),
    });

    res.send({ book, avgRating, reviews: paginatedReviews });
});

// POST /books/:id/reviews (Authenticated, One per user per book)
router.post("/:id/reviews", authenticate, async (req, res) => {
    const existingReview = await Review.findOne({
        where: { BookId: req.params.id, UserId: req.user.id },
    });
    if (existingReview)
        return res.status(400).send("You already reviewed this book");

    const review = await Revconstiew.create({
        BookId: req.params.id,
        UserId: req.user.id,
        rating: req.body.rating,
        comment: req.body.comment,
    });

    res.status(201).send(review);
});

module.exports = { router };
